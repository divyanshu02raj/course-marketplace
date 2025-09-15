// course-marketplace-backend/controllers/certificateController.js
const Certificate = require('../models/Certificate');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');

// Fetches all certificates belonging to the currently logged-in user.
exports.getMyCertificates = async (req, res) => {
    try {
        const studentId = req.user._id;
        const certificates = await Certificate.find({ user: studentId })
            .populate({
                path: 'course',
                select: 'title thumbnail instructor',
                populate: {
                    path: 'instructor',
                    select: 'name'
                }
            })
            .populate('user', 'name')
            .sort({ issueDate: -1 })
            .lean();

        // For each certificate, find the associated score from their best passing attempt.
        for (const cert of certificates) {
            const assessment = await Assessment.findOne({ course: cert.course._id });
            if (assessment) {
                const attempt = await AssessmentAttempt.findOne({
                    assessment: assessment._id,
                    student: studentId,
                    passed: true
                }).sort({ score: -1 }); // Get the highest score
                if (attempt) {
                    cert.score = attempt.score;
                }
            }
        }
        
        res.json(certificates);
    } catch (error) {
        console.error("Error in getMyCertificates:", error);
        res.status(500).json({ message: "Error fetching your certificates." });
    }
};

exports.getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
            .populate('user', 'name')
            .populate({
                path: 'course',
                select: 'title',
                populate: {
                    path: 'instructor',
                    select: 'name'
                }
            })
            .lean();

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found.' });
        }

        if (certificate.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to view this certificate." });
        }
        
        // Find the score from the student's highest-scoring passed attempt.
        const assessment = await Assessment.findOne({ course: certificate.course._id });
        if (assessment) {
            const attempt = await AssessmentAttempt.findOne({
                assessment: assessment._id,
                student: certificate.user._id,
                passed: true
            }).sort({ score: -1 });

            if (attempt) {
                certificate.score = attempt.score;
            }
        }

        res.json(certificate);
    } catch (error) {
        console.error("Error in getCertificateById:", error);
        res.status(500).json({ message: "Error fetching certificate." });
    }
};

// Public endpoint to verify a certificate's authenticity via its unique ID (e.g., from a QR code).
exports.verifyCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
            .populate('user', 'name')
            .populate({
                path: 'course',
                select: 'title instructor',
                populate: {
                    path: 'instructor',
                    select: 'name'
                }
            });

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found or invalid.' });
        }

        // Fetch the final score to display on the public verification page.
        let finalScore = null;
        const assessment = await Assessment.findOne({ course: certificate.course._id });
        if (assessment) {
            const attempt = await AssessmentAttempt.findOne({
                assessment: assessment._id,
                student: certificate.user._id,
                passed: true
            }).sort({ score: -1 });

            if (attempt) {
                finalScore = attempt.score;
            }
        }

        res.json({
            studentName: certificate.user.name,
            courseTitle: certificate.course.title,
            instructorName: certificate.course.instructor?.name || 'An Instructor',
            issueDate: certificate.issueDate,
            score: finalScore,
            isValid: true
        });
    } catch (error) {
        console.error("Error in verifyCertificate:", error);
        res.status(500).json({ message: "Error verifying certificate." });
    }
};

// Generates a PDF of the certificate by securely rendering a frontend page using Puppeteer.
exports.downloadCertificate = async (req, res) => {
    let browser = null;
    try {
        const { certificateId } = req.params;
        const userId = req.user._id;

        const certificate = await Certificate.findOne({ certificateId, user: userId })
            .populate('user', 'name')
            .populate({
                path: 'course',
                select: 'title instructor',
                populate: { path: 'instructor', select: 'name' }
            });

        if (!certificate) {
            return res.status(404).json({ message: "Certificate not found or you are not authorized." });
        }

        let finalScore = null;
        const assessment = await Assessment.findOne({ course: certificate.course._id });
        if (assessment) {
            const attempt = await AssessmentAttempt.findOne({
                assessment: assessment._id,
                student: userId,
                passed: true
            }).sort({ score: -1 });
            if (attempt) {
                finalScore = attempt.score;
            }
        }

        const certificateData = {
            studentName: certificate.user.name,
            courseTitle: certificate.course.title,
            instructorName: certificate.course.instructor.name,
            issueDate: certificate.issueDate,
            score: finalScore,
            certificateId: certificate.certificateId
        };
        
        // Create a short-lived, secure token containing the certificate data.
        // This prevents users from creating fake certificates by manipulating URL params.
        const printToken = jwt.sign(certificateData, process.env.JWT_SECRET, { expiresIn: '5m' });

        let frontendUrl;
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
        frontendUrl = process.env.NODE_ENV === 'production' 
            ? allowedOrigins.find(url => url.startsWith('https'))
            : allowedOrigins.find(url => url.startsWith('http://localhost'));
        if (!frontendUrl) frontendUrl = 'http://localhost:3000';

        // Use a lightweight chromium binary for production (serverless friendly) and full puppeteer for development.
        let browserConfig;
        if (process.env.NODE_ENV === 'production') {
            const chromium = require('@sparticuz/chromium');
            const puppeteerCore = require('puppeteer-core');
            browserConfig = {
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
            };
            browser = await puppeteerCore.launch(browserConfig);
        } else {
            browserConfig = {
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            };
            browser = await puppeteer.launch(browserConfig);
        }
        
        const page = await browser.newPage();
        const printUrl = `${frontendUrl}/print-certificate?token=${printToken}`;
        
        // Navigate to the frontend page and wait until it's fully loaded.
        await page.goto(printUrl, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            // Tells the browser to prompt a download with a specific filename.
            'Content-Disposition': `attachment; filename="certificate-${certificateId}.pdf"`
        });
        res.send(pdfBuffer);

    } catch (error) {
        console.error("PDF Download Error:", error);
        res.status(500).json({ message: "Error generating certificate PDF." });
    } finally {
        // Ensure the browser instance is always closed to prevent memory leaks.
        if (browser) {
            await browser.close();
        }
    }
};
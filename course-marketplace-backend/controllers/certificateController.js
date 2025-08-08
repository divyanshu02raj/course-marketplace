const Certificate = require('../models/Certificate');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const puppeteer = require('puppeteer');
const Course = require('../models/Course'); // Ensure Course model is imported

// --- Other controller functions (getMyCertificates, etc.) remain the same ---
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

        for (const cert of certificates) {
            const assessment = await Assessment.findOne({ course: cert.course._id });
            if (assessment) {
                const attempt = await AssessmentAttempt.findOne({
                    assessment: assessment._id,
                    student: studentId,
                    passed: true
                }).sort({ score: -1 });
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

/**
 * @desc    Generate and download a certificate as a PDF
 * @route   GET /api/certificates/:certificateId/download
 * @access  Private
 */
exports.downloadCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;
        const userId = req.user._id;

        const certificate = await Certificate.findOne({ certificateId, user: userId });
        if (!certificate) {
            return res.status(404).json({ message: "Certificate not found or you are not authorized." });
        }

        const browser = await puppeteer.launch({ 
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        let frontendUrl;
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
        if (process.env.NODE_ENV === 'production') {
            frontendUrl = allowedOrigins.find(url => url.startsWith('https'));
        } else {
            frontendUrl = allowedOrigins.find(url => url.startsWith('http://localhost'));
        }
        if (!frontendUrl) {
            frontendUrl = 'http://localhost:3000'; // Fallback
        }
        
        // ** THE FIX IS HERE **
        // 1. Correctly read the cookie named "token".
        const token = req.cookies.token;
        if (token) {
            const parsedUrl = new URL(frontendUrl);
            // 2. Set the cookie in Puppeteer with the correct name "token".
            await page.setCookie({
                name: 'token',
                value: token,
                domain: parsedUrl.hostname,
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            });
        } else {
             return res.status(401).json({ message: 'Authentication cookie not found.' });
        }
        
        const certificateUrl = `${frontendUrl}/certificate/${certificateId}?print=true`;
        
        await page.goto(certificateUrl, {
            waitUntil: 'networkidle0'
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': `attachment; filename="certificate-${certificateId}.pdf"`
        });
        res.send(pdfBuffer);

    } catch (error) {
        console.error("PDF Download Error:", error);
        res.status(500).json({ message: "Error generating certificate PDF." });
    }
};

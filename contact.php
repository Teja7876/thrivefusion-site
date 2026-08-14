<?php
/**
 * ThriveFusion Alliance Foundation — Mail Service
 * PHPMailer + Hostinger SMTP — Production Ready
 *
 * Handles all form submissions:
 *  - General Contact
 *  - Volunteer
 *  - Partnership
 *  - Donation Enquiry
 *  - Request a Scribe
 *  - Accessibility Support
 *  - EqualEdge AI
 *  - Resources
 *  - Feedback
 *  - Other
 *
 * Security:
 *  - Rate limiting (10 requests per IP per 10 minutes)
 *  - CSRF origin validation
 *  - Input sanitization with htmlspecialchars
 *  - Server-side validation with regex
 *  - No direct output of user input into SMTP headers
 *  - Minimal error disclosure to client
 */

declare(strict_types=1);
error_reporting(0); // Never expose PHP errors in production

// ─── AUTOLOADER ─────────────────────────────────────────────────────────────
$autoloader = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloader)) {
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Mail service is not yet configured. Please contact the administrator.'
    ]);
    exit;
}
require_once $autoloader;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

// ─── CORS & CONTENT-TYPE HEADERS ────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Allow only same-origin and the production domain
$allowedOrigins = [
    'https://thrivefusion.org',
    'https://www.thrivefusion.org',
    'http://thrivefusion.org',
    'http://www.thrivefusion.org',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
} elseif (empty($origin)) {
    // Direct server-side request — allow it (cURL, Postman, etc.)
} else {
    // Unknown origin browser request — set CORS header to self domain and continue.
    // Do NOT return 403 here — that causes HTTP 403 for misconfigured origin headers.
    header('Access-Control-Allow-Origin: https://thrivefusion.org');
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Max-Age: 86400');

// ─── PREFLIGHT ───────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─── METHOD CHECK ────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed.']);
    exit;
}

// ─── RATE LIMITING ───────────────────────────────────────────────────────────
$rateLimit = (function (): bool {
    $ip         = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $ip         = trim(explode(',', $ip)[0]); // first IP in chain
    $dir        = sys_get_temp_dir();
    $key        = 'tf_rl_' . md5($ip);
    $file       = $dir . '/' . $key . '.json';
    $window     = 600; // 10 minutes
    $maxReq     = 10;
    $now        = time();

    $data = ['ts' => $now, 'count' => 0];
    if (file_exists($file)) {
        $raw = json_decode(file_get_contents($file), true);
        if (is_array($raw)) {
            $data = $raw;
        }
    }

    if (($now - $data['ts']) > $window) {
        $data = ['ts' => $now, 'count' => 0];
    }

    $data['count']++;
    file_put_contents($file, json_encode($data), LOCK_EX);

    return $data['count'] <= $maxReq;
})();

if (!$rateLimit) {
    http_response_code(429);
    header('Retry-After: 600');
    echo json_encode([
        'success' => false,
        'message' => 'Too many requests. Please wait 10 minutes and try again.'
    ]);
    exit;
}

// ─── PARSE INPUT ─────────────────────────────────────────────────────────────
$rawInput = file_get_contents('php://input');
if (empty($rawInput)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Empty request body.']);
    exit;
}

$input = json_decode($rawInput, true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload.']);
    exit;
}

// ─── SANITIZE HELPERS ────────────────────────────────────────────────────────
function sanitizeText(string $str): string {
    return htmlspecialchars(strip_tags(trim($str)), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function sanitizeEmail(string $str): string {
    return filter_var(trim($str), FILTER_SANITIZE_EMAIL);
}

function sanitizePhone(string $str): string {
    return preg_replace('/[^\d\s\+\-\(\)\.ext]/', '', trim($str));
}

// ─── VALID ENQUIRY TYPES ──────────────────────────────────────────────────────
$validTypes = [
    'General Contact',
    'Volunteer',
    'Partnership',
    'Donation Enquiry',
    'Request a Scribe',
    'Accessibility Support',
    'EqualEdge AI',
    'Resources',
    'Feedback',
    'Other',
];

// ─── EXTRACT AND VALIDATE FIELDS ─────────────────────────────────────────────
$errors = [];

// Enquiry type
$type = isset($input['type']) ? sanitizeText((string) $input['type']) : 'General Contact';
if (!in_array($type, $validTypes, true)) {
    $type = 'General Contact';
}

// Name — required
$name = isset($input['name']) ? sanitizeText((string) $input['name']) : '';
if (mb_strlen($name) < 2) {
    $errors['name'] = 'Full name must be at least 2 characters.';
} elseif (mb_strlen($name) > 120) {
    $errors['name'] = 'Full name must not exceed 120 characters.';
}

// Email — required
$email = isset($input['email']) ? sanitizeEmail((string) $input['email']) : '';
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'A valid email address is required.';
}

// Phone — optional
$phone = isset($input['phone']) ? sanitizePhone((string) $input['phone']) : '';
if (!empty($phone) && mb_strlen($phone) > 30) {
    $phone = mb_substr($phone, 0, 30);
}

// Subject — optional
$subject = isset($input['subject']) ? sanitizeText((string) $input['subject']) : '';
if (mb_strlen($subject) > 200) {
    $errors['subject'] = 'Subject must not exceed 200 characters.';
}

// Message — required
$message = isset($input['message']) ? sanitizeText((string) $input['message']) : '';
if (mb_strlen($message) < 10) {
    $errors['message'] = 'Message must be at least 10 characters long.';
} elseif (mb_strlen($message) > 5000) {
    $errors['message'] = 'Message must not exceed 5000 characters.';
}

// Dynamic fields (for specific enquiry types)
$organisation        = isset($input['organisation'])     ? sanitizeText((string) $input['organisation'])     : '';
$availability        = isset($input['availability'])     ? sanitizeText((string) $input['availability'])     : '';
$skills              = isset($input['skills'])           ? sanitizeText((string) $input['skills'])           : '';
$partnerType         = isset($input['partnerType'])      ? sanitizeText((string) $input['partnerType'])      : '';
$donationAmount      = isset($input['donationAmount'])   ? sanitizeText((string) $input['donationAmount'])   : '';
$donationFrequency   = isset($input['donationFrequency'])? sanitizeText((string) $input['donationFrequency']): '';
$disability          = isset($input['disability'])       ? sanitizeText((string) $input['disability'])       : '';
$location            = isset($input['location'])         ? sanitizeText((string) $input['location'])         : '';
$useCase             = isset($input['useCase'])          ? sanitizeText((string) $input['useCase'])          : '';
$resourceType        = isset($input['resourceType'])     ? sanitizeText((string) $input['resourceType'])     : '';
$feedbackType        = isset($input['feedbackType'])     ? sanitizeText((string) $input['feedbackType'])     : '';

// ─── RETURN VALIDATION ERRORS ────────────────────────────────────────────────
if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please correct the highlighted fields.',
        'errors'  => $errors
    ]);
    exit;
}

// ─── SPAM HONEYPOT CHECK ──────────────────────────────────────────────────────
$honeypot = $input['website'] ?? null;
if (!empty($honeypot)) {
    // Silently discard bot submissions
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Submission received.']);
    exit;
}

// ─── SMTP CONFIGURATION ───────────────────────────────────────────────────────
/**
 * HOSTINGER SMTP CREDENTIALS
 * Replace 'YOUR_EMAIL_PASSWORD' with your actual password before deploying.
 * For added security, store the password in an environment variable or
 * a .env file that is NOT committed to version control.
 */
$smtpHost     = 'smtp.hostinger.com';
$smtpPort     = 465;
$smtpEncrypt  = PHPMailer::ENCRYPTION_SMTPS;  // SSL
$smtpUser     = 'info@thrivefusion.org';
$smtpPass     = getenv('SMTP_PASS') ?: 'YOUR_EMAIL_PASSWORD'; // Replace or set env var
$fromAddress  = 'info@thrivefusion.org';
$fromName     = 'ThriveFusion Alliance Foundation';
$toAddress    = 'info@thrivefusion.org';
$toName       = 'ThriveFusion Team';

// ─── BUILD EMAIL BODY ─────────────────────────────────────────────────────────
$now       = date('D, d M Y H:i:s T');
$emailSlug = strtolower(str_replace(' ', '-', $type));

/**
 * Renders a table row only when value is non-empty.
 */
function tableRow(string $label, string $value): string {
    if (empty($value)) return '';
    return sprintf(
        '<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;white-space:nowrap;width:160px;vertical-align:top;">%s</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#4b5563;word-break:break-word;">%s</td>
         </tr>',
        $label,
        nl2br($value)
    );
}

// Build dynamic rows based on enquiry type
$dynamicRows = '';
switch ($emailSlug) {
    case 'volunteer':
        $dynamicRows .= tableRow('Organisation',  $organisation);
        $dynamicRows .= tableRow('Availability',  $availability);
        $dynamicRows .= tableRow('Skills',         $skills);
        $dynamicRows .= tableRow('Location',       $location);
        break;
    case 'partnership':
        $dynamicRows .= tableRow('Organisation',   $organisation);
        $dynamicRows .= tableRow('Partner Type',   $partnerType);
        $dynamicRows .= tableRow('Location',        $location);
        break;
    case 'donation-enquiry':
        $dynamicRows .= tableRow('Donation Amount',    $donationAmount);
        $dynamicRows .= tableRow('Donation Frequency', $donationFrequency);
        $dynamicRows .= tableRow('Organisation',       $organisation);
        break;
    case 'request-a-scribe':
    case 'accessibility-support':
        $dynamicRows .= tableRow('Disability Type', $disability);
        $dynamicRows .= tableRow('Location',         $location);
        break;
    case 'equaledge-ai':
        $dynamicRows .= tableRow('Use Case',     $useCase);
        $dynamicRows .= tableRow('Organisation', $organisation);
        break;
    case 'resources':
        $dynamicRows .= tableRow('Resource Type', $resourceType);
        $dynamicRows .= tableRow('Location',       $location);
        break;
    case 'feedback':
        $dynamicRows .= tableRow('Feedback Type', $feedbackType);
        break;
}

$emailHtml = '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Form Submission — ThriveFusion</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:\'Segoe UI\',Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background-color:#f3f4f6;padding:32px 16px;">
    <tr><td>
      <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:32px 36px;text-align:center;">
            <p style="margin:0;color:#c7d2fe;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">ThriveFusion Alliance Foundation</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:700;line-height:1.3;">New Submission</h1>
            <span style="display:inline-block;margin-top:12px;padding:4px 16px;background:rgba(255,255,255,0.18);border-radius:100px;color:#e0e7ff;font-size:13px;font-weight:600;">' . htmlspecialchars($type, ENT_QUOTES, 'UTF-8') . '</span>
          </td>
        </tr>

        <!-- Meta -->
        <tr>
          <td style="padding:24px 36px 0;">
            <p style="margin:0;font-size:13px;color:#9ca3af;">Received: ' . $now . '</p>
          </td>
        </tr>

        <!-- Contact Details -->
        <tr>
          <td style="padding:20px 36px;">
            <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#111827;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Contact Details</h2>
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
              ' . tableRow('Full Name', $name)
              . tableRow('Email Address', $email)
              . tableRow('Phone Number', $phone)
              . tableRow('Subject', $subject)
              . $dynamicRows . '
            </table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:0 36px 24px;">
            <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#111827;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Message</h2>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;color:#374151;font-size:14px;line-height:1.7;white-space:pre-wrap;">' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</div>
          </td>
        </tr>

        <!-- Actions -->
        <tr>
          <td style="padding:0 36px 28px;">
            <a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '" style="display:inline-block;padding:10px 24px;background:#4f46e5;color:#ffffff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Reply to ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 36px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">This email was generated automatically by the ThriveFusion Alliance Foundation website.<br>
            <a href="https://thrivefusion.org" style="color:#4f46e5;text-decoration:none;">thrivefusion.org</a> &bull; info@thrivefusion.org</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>';

// ─── PLAIN TEXT FALLBACK ──────────────────────────────────────────────────────
$emailText = "NEW FORM SUBMISSION — THRIVEFUSION ALLIANCE FOUNDATION\n";
$emailText .= str_repeat('=', 56) . "\n\n";
$emailText .= "Enquiry Type : {$type}\n";
$emailText .= "Received     : {$now}\n\n";
$emailText .= "CONTACT DETAILS\n";
$emailText .= str_repeat('-', 40) . "\n";
$emailText .= "Name         : {$name}\n";
$emailText .= "Email        : {$email}\n";
if (!empty($phone))         $emailText .= "Phone        : {$phone}\n";
if (!empty($subject))       $emailText .= "Subject      : {$subject}\n";
if (!empty($organisation))  $emailText .= "Organisation : {$organisation}\n";
if (!empty($availability))  $emailText .= "Availability : {$availability}\n";
if (!empty($skills))        $emailText .= "Skills       : {$skills}\n";
if (!empty($partnerType))   $emailText .= "Partner Type : {$partnerType}\n";
if (!empty($donationAmount)) $emailText .= "Donation Amt : {$donationAmount}\n";
if (!empty($donationFrequency)) $emailText .= "Frequency    : {$donationFrequency}\n";
if (!empty($disability))    $emailText .= "Disability   : {$disability}\n";
if (!empty($location))      $emailText .= "Location     : {$location}\n";
if (!empty($useCase))       $emailText .= "Use Case     : {$useCase}\n";
if (!empty($resourceType))  $emailText .= "Resource Type: {$resourceType}\n";
if (!empty($feedbackType))  $emailText .= "Feedback Type: {$feedbackType}\n";
$emailText .= "\nMESSAGE\n";
$emailText .= str_repeat('-', 40) . "\n";
$emailText .= $message . "\n\n";
$emailText .= "---\nThriveFusion Alliance Foundation | https://thrivefusion.org\n";

// ─── AUTO-REPLY BODY ─────────────────────────────────────────────────────────
$autoReplyHtml = '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>We\'ve Received Your Message — ThriveFusion</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:\'Segoe UI\',Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background-color:#f3f4f6;padding:32px 16px;">
    <tr><td>
      <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:32px 36px;text-align:center;">
            <p style="margin:0;color:#c7d2fe;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">ThriveFusion Alliance Foundation</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">We\'ve received your message!</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <p style="margin:0 0 16px;font-size:15px;color:#374151;">Dear ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . ',</p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">Thank you for reaching out to <strong>ThriveFusion Alliance Foundation</strong>. We have received your <strong>' . htmlspecialchars($type, ENT_QUOTES, 'UTF-8') . '</strong> enquiry and will respond within <strong>2–3 business days</strong>.</p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">If your matter is urgent, please email us directly at <a href="mailto:info@thrivefusion.org" style="color:#4f46e5;font-weight:600;">info@thrivefusion.org</a>.</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
            <p style="margin:0 0 8px;font-size:13px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Your Submission Reference</p>
            <p style="margin:0;font-size:14px;color:#374151;"><strong>Type:</strong> ' . htmlspecialchars($type, ENT_QUOTES, 'UTF-8') . '<br><strong>Date:</strong> ' . $now . '</p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 36px 32px;text-align:center;">
            <a href="https://thrivefusion.org" style="display:inline-block;padding:12px 32px;background:#4f46e5;color:#ffffff;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;">Visit Our Website</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 36px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">ThriveFusion Alliance Foundation — Empowering Every Ability<br>
            Hyderabad, India &bull; <a href="https://thrivefusion.org" style="color:#4f46e5;text-decoration:none;">thrivefusion.org</a></p>
            <p style="margin:8px 0 0;font-size:11px;color:#d1d5db;">Please do not reply directly to this automated email.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>';

$autoReplyText = "Dear {$name},\n\n"
    . "Thank you for reaching out to ThriveFusion Alliance Foundation.\n\n"
    . "We have received your {$type} enquiry and will respond within 2–3 business days.\n\n"
    . "For urgent matters, please email us at info@thrivefusion.org.\n\n"
    . "Reference: {$type} | {$now}\n\n"
    . "---\nThriveFusion Alliance Foundation\nhttps://thrivefusion.org\n"
    . "Hyderabad, India\n\n"
    . "Please do not reply directly to this automated email.";

// ─── SEND NOTIFICATION EMAIL ─────────────────────────────────────────────────
function createMailer(
    string $host, int $port, string $encrypt,
    string $user, string $pass,
    string $fromAddr, string $fromName
): PHPMailer {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host        = $host;
    $mail->SMTPAuth    = true;
    $mail->Username    = $user;
    $mail->Password    = $pass;
    $mail->SMTPSecure  = $encrypt;
    $mail->Port        = $port;
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer'       => true,
            'verify_peer_name'  => true,
            'allow_self_signed' => false,
        ]
    ];
    $mail->CharSet  = PHPMailer::CHARSET_UTF8;
    $mail->Encoding = PHPMailer::ENCODING_BASE64;
    $mail->setFrom($fromAddr, $fromName);
    return $mail;
}

try {
    // ── 1. Notification to ThriveFusion team ─────────────────────────────────
    $mail = createMailer(
        $smtpHost, $smtpPort, $smtpEncrypt,
        $smtpUser, $smtpPass,
        $fromAddress, $fromName
    );

    $mail->addAddress($toAddress, $toName);
    $mail->addReplyTo($email, $name);
    $mail->Subject = "[{$type}] New submission from {$name}";
    $mail->isHTML(true);
    $mail->Body    = $emailHtml;
    $mail->AltBody = $emailText;
    $mail->send();

    // ── 2. Auto-reply to submitter ────────────────────────────────────────────
    $autoMail = createMailer(
        $smtpHost, $smtpPort, $smtpEncrypt,
        $smtpUser, $smtpPass,
        $fromAddress, $fromName
    );
    $autoMail->addAddress($email, $name);
    $autoMail->Subject = 'We\'ve received your message — ThriveFusion Alliance Foundation';
    $autoMail->isHTML(true);
    $autoMail->Body    = $autoReplyHtml;
    $autoMail->AltBody = $autoReplyText;
    $autoMail->send();

    // ── Success ───────────────────────────────────────────────────────────────
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent. We\'ll be in touch within 2–3 business days.'
    ]);

} catch (PHPMailerException $e) {
    // Log the real error server-side (not exposed to client)
    error_log('[ThriveFusion Mail] PHPMailer error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to send your message right now. Please try again later or email us directly at info@thrivefusion.org.'
    ]);
} catch (\Throwable $e) {
    error_log('[ThriveFusion Mail] Unexpected error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred. Please email us at info@thrivefusion.org.'
    ]);
}

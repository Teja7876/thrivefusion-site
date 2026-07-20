<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// Extract fields
$type = $input['type'] ?? 'General Contact';
$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$phone = $input['phone'] ?? '';
$subject = $input['subject'] ?? '';
$message = $input['message'] ?? '';

// SMTP Configuration (Configure these for Hostinger)
$smtp_host = 'smtp.hostinger.com';
$smtp_port = 465;
$smtp_user = 'info@thrivefusion.org'; // Replace with actual email
$smtp_pass = 'YOUR_EMAIL_PASSWORD';   // Replace with actual password
$to_email = 'info@thrivefusion.org';

function sendSmtpMail($host, $port, $user, $pass, $from, $to, $subject, $body) {
    $socket = fsockopen('ssl://' . $host, $port, $errno, $errstr, 15);
    if (!$socket) return false;

    function readSmtp($sock) {
        $res = '';
        while ($line = fgets($sock, 515)) {
            $res .= $line;
            if (substr($line, 3, 1) == ' ') break;
        }
        return $res;
    }

    readSmtp($socket);
    fputs($socket, "EHLO $host\r\n");
    readSmtp($socket);

    fputs($socket, "AUTH LOGIN\r\n");
    readSmtp($socket);
    fputs($socket, base64_encode($user) . "\r\n");
    readSmtp($socket);
    fputs($socket, base64_encode($pass) . "\r\n");
    $auth_res = readSmtp($socket);
    
    if (substr($auth_res, 0, 3) !== '235') {
        fclose($socket);
        return false;
    }

    fputs($socket, "MAIL FROM: <$from>\r\n");
    readSmtp($socket);
    fputs($socket, "RCPT TO: <$to>\r\n");
    readSmtp($socket);
    
    fputs($socket, "DATA\r\n");
    readSmtp($socket);

    $headers = "From: $from\r\n";
    $headers .= "To: $to\r\n";
    $headers .= "Subject: $subject\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    $data = $headers . "\r\n" . $body . "\r\n.\r\n";
    fputs($socket, $data);
    $send_res = readSmtp($socket);

    fputs($socket, "QUIT\r\n");
    fclose($socket);
    
    return substr($send_res, 0, 3) === '250';
}

$now = date('Y-m-d H:i:s');
$emailHtml = "
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;'>
    <h2 style='color: #4f46e5;'>New Submission: $type</h2>
    <p><strong>Date & Time:</strong> $now</p>
    <table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>
        <tr><td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;'>Name</td><td style='padding: 8px; border-bottom: 1px solid #ddd;'>$name</td></tr>
        <tr><td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;'>Email</td><td style='padding: 8px; border-bottom: 1px solid #ddd;'>$email</td></tr>
        <tr><td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;'>Phone</td><td style='padding: 8px; border-bottom: 1px solid #ddd;'>$phone</td></tr>
        <tr><td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;'>Subject</td><td style='padding: 8px; border-bottom: 1px solid #ddd;'>$subject</td></tr>
    </table>
    <h3 style='margin-top: 24px;'>Message</h3>
    <div style='background-color: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #eee; white-space: pre-wrap;'>$message</div>
</div>
";

$sent = sendSmtpMail($smtp_host, $smtp_port, $smtp_user, $smtp_pass, $smtp_user, $to_email, "New $type Form Submission from $name", $emailHtml);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Submission successful']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to send your enquiry right now (SMTP Error).']);
}

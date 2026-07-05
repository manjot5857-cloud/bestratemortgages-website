<?php
/**
 * submit.php — BestRate Mortgages contact form handler
 * ---------------------------------------------------
 * Receives the contact.html form (via fetch/POST), validates and
 * sanitizes the input, and emails it to the inbox below.
 *
 * REQUIREMENTS
 * This file needs a real PHP host with mail() enabled (most shared
 * hosting — Bluehost, SiteGround, HostPapa, cPanel, etc. — supports
 * this out of the box). It will NOT run on static-only hosts like
 * GitHub Pages, Netlify (without a function), or Cloudflare Pages.
 * If your host is static-only, tell me and I'll build a version
 * that posts to a form service (e.g. Formspree) instead.
 *
 * TO CHANGE THE DESTINATION INBOX
 * Edit the $to_email value just below.
 */

$to_email   = 'info@bestratemortgages.ca';
$site_name  = 'BestRate Mortgages';

// The From address must be a mailbox on your own domain, or many
// mail servers will reject/spam-flag the message. The visitor's
// address is set as Reply-To instead, so hitting "Reply" in your
// inbox goes straight to them.
$from_email = 'no-reply@bestratemortgages.ca';

header('Content-Type: application/json');

// Only allow POST requests
if($_SERVER['REQUEST_METHOD'] !== 'POST'){
  http_response_code(405);
  echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
  exit;
}

// ---------- helpers ----------
function clean_field($value){
  $value = trim($value ?? '');
  // Strip anything that could be used for header/email injection
  $value = str_replace(["\r", "\n"], '', $value);
  return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function is_valid_email($email){
  return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// ---------- honeypot spam check ----------
// contact.html includes a hidden field named "company" that real
// visitors never fill in. If it has a value, silently pretend
// success and stop (bots usually fill every field).
if(!empty($_POST['company'])){
  echo json_encode(['success' => true]);
  exit;
}

// ---------- gather + validate fields ----------
$full_name = clean_field($_POST['fullName'] ?? '');
$email     = trim($_POST['email'] ?? '');
$phone     = clean_field($_POST['phone'] ?? '');
$need      = clean_field($_POST['need'] ?? '');
$province  = clean_field($_POST['province'] ?? '');
$timeline  = clean_field($_POST['timeline'] ?? '');
$message   = clean_field($_POST['message'] ?? '');

$errors = [];
if($full_name === ''){ $errors[] = 'Full name is required.'; }
if($email === '' || !is_valid_email($email)){ $errors[] = 'A valid email address is required.'; }
if($phone === ''){ $errors[] = 'Phone number is required.'; }

if(!empty($errors)){
  http_response_code(422);
  echo json_encode(['success' => false, 'error' => implode(' ', $errors)]);
  exit;
}

$email_clean = str_replace(["\r", "\n"], '', $email);

// ---------- build the email ----------
$subject = "New rate quote request — {$full_name}";

$body  = "New contact form submission from {$site_name}\n";
$body .= str_repeat('-', 44) . "\n\n";
$body .= "Name:      {$full_name}\n";
$body .= "Email:     {$email_clean}\n";
$body .= "Phone:     {$phone}\n";
$body .= "Need:      {$need}\n";
$body .= "Province:  {$province}\n";
$body .= "Timeline:  {$timeline}\n\n";
$body .= "Message:\n{$message}\n\n";
$body .= str_repeat('-', 44) . "\n";
$body .= "Submitted: " . date('Y-m-d H:i:s') . " (server time)\n";
$body .= "IP:        " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

$headers  = "From: {$site_name} <{$from_email}>\r\n";
$headers .= "Reply-To: {$full_name} <{$email_clean}>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($to_email, $subject, $body, $headers);

if($sent){
  echo json_encode(['success' => true]);
} else {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'The message could not be sent. Please try again or call us directly.']);
}

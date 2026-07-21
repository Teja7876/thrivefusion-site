<?php
/**
 * ThriveFusion Alliance Foundation — Vendor Autoloader
 *
 * A simple PSR-4 autoloader that loads PHPMailer classes.
 * This replaces the need for `composer install` on the server.
 * PHPMailer source files are committed to the repository under vendor/.
 */

$vendorDir = __DIR__;

// Register PSR-4 autoloader for PHPMailer
spl_autoload_register(function (string $class) use ($vendorDir): void {
    $prefix = 'PHPMailer\\PHPMailer\\';
    $baseDir = $vendorDir . '/phpmailer/phpmailer/src/';

    if (strncmp($prefix, $class, strlen($prefix)) !== 0) {
        return;
    }

    $relativeClass = substr($class, strlen($prefix));
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$mail = new PHPMailer(true);

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$tgToken = $_ENV['TG_KEY'];
$chatId = $_ENV['CHAT_ID'];

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);
// Получите данные из формы (в данном примере используется метод POST)
$userName = $data['name'];
$userPhone = preg_replace('/\s+/', '', $data['phone']);
$userMessage = $data['text'];

// Формируем сообщение для отправки в Telegram
$message = "Кажется кто-то хочет купить волосы!\n";
$message .= "<b>Имя:</b> " . $userName . "\n";
$message .= "<b>Телефон:</b> " . $userPhone . "\n";
$message .= "<b>Сообщение:</b> " . $userMessage . "\n";

// Отправляем сообщение в Telegram
message_to_telegram($message, $tgToken, $chatId);

function message_to_telegram($message, $tgToken, $chatId)
{
    $ch = curl_init();
    curl_setopt_array(
        $ch,
        array(
            CURLOPT_URL => 'https://api.telegram.org/bot' . $tgToken . '/sendMessage',
            CURLOPT_POST => TRUE,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_POSTFIELDS => array(
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML'
            ),
        )
    );
    curl_exec($ch);
}
?>


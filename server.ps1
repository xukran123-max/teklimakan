$root = "C:\Users\ThinkPad\Desktop\web\teklimakan"
$port = 8080
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
$listener.Start()
Write-Host "=========================================="
Write-Host "Server running at: http://192.168.143.180:$port/"
Write-Host "Local URL:         http://localhost:$port/"
Write-Host "=========================================="

$mimeTypes = @{
    '.html'  = 'text/html; charset=utf-8'
    '.htm'   = 'text/html; charset=utf-8'
    '.css'   = 'text/css; charset=utf-8'
    '.js'    = 'application/javascript; charset=utf-8'
    '.json'  = 'application/json; charset=utf-8'
    '.png'   = 'image/png'
    '.jpg'   = 'image/jpeg'
    '.jpeg'  = 'image/jpeg'
    '.webp'  = 'image/webp'
    '.gif'   = 'image/gif'
    '.svg'   = 'image/svg+xml'
    '.ico'   = 'image/x-icon'
    '.woff'  = 'font/woff'
    '.woff2' = 'font/woff2'
    '.ttf'   = 'font/ttf'
}

function ReadBodyString($reader, $contentLength) {
    if ($contentLength -le 0) { return "" }
    $sb = New-Object System.Text.StringBuilder
    while ($reader.Peek() -ge 0) {
        $ch = $reader.Read()
        if ($ch -lt 0) { break }
        $sb.Append([char]$ch) | Out-Null
    }
    return $sb.ToString()
}

while ($true) {
    $client = $null
    try {
        $client = $listener.AcceptTcpClient()
        $client.ReceiveTimeout = 4000
        $client.SendTimeout = 4000
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)
        $requestLine = $reader.ReadLine()
        if (-not $requestLine) {
            $client.Close()
            continue
        }

        $contentLength = 0
        while ($line = $reader.ReadLine()) {
            if ($line -match '^Content-Length:\s*(\d+)') {
                $contentLength = [int]$matches[1]
            }
            if ($line.Trim() -eq "") { break }
        }

        $parts = $requestLine -split " "
        if ($parts.Length -lt 2) {
            $client.Close()
            continue
        }

        $method = $parts[0].ToUpper()
        $url = $parts[1]
        if ($url.Contains("?")) { $url = $url.Substring(0, $url.IndexOf("?")) }

        # CORS Preflight
        if ($method -eq "OPTIONS") {
            $header = "HTTP/1.1 204 No Content`r`nAccess-Control-Allow-Origin: *`r`nAccess-Control-Allow-Headers: *`r`nAccess-Control-Allow-Methods: GET, POST, OPTIONS`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Flush()
            $client.Close()
            continue
        }

        # API Endpoint: /api/send-email
        if ($method -eq "POST" -and $url -eq "/api/send-email") {
            $bodyStr = ReadBodyString $reader $contentLength
            $respObj = @{ success = $false; message = "Initial state" }
            try {
                $payload = $bodyStr | ConvertFrom-Json
                $smtpHost = if ($payload.smtpHost) { $payload.smtpHost.Trim() } else { "smtp.gmail.com" }
                $smtpPort = if ($payload.smtpPort) { [int]$payload.smtpPort } else { 587 }
                $smtpUser = if ($payload.smtpUser) { $payload.smtpUser.Trim() } else { "" }
                $smtpPass = if ($payload.smtpPass) { $payload.smtpPass.Trim() } else { "" }
                $fromEmail = if ($payload.fromEmail) { $payload.fromEmail.Trim() } else { $smtpUser }
                $fromName = if ($payload.fromName) { $payload.fromName.Trim() } else { "Teklimakan Store" }
                $toEmail = if ($payload.toEmail) { $payload.toEmail.Trim() } else { $smtpUser }
                $subject = if ($payload.subject) { $payload.subject } else { "New Order Notification" }
                $htmlBody = if ($payload.htmlBody) { $payload.htmlBody } else { $payload.textBody }

                if (-not $smtpUser -or -not $smtpPass) {
                    throw "Email address or App Password is missing!"
                }
                if (-not $toEmail) {
                    throw "Destination email is missing!"
                }

                $smtp = New-Object System.Net.Mail.SmtpClient($smtpHost, $smtpPort)
                $smtp.EnableSsl = ($payload.useSsl -ne $false)
                $smtp.Timeout = 15000
                $smtp.Credentials = New-Object System.Net.NetworkCredential($smtpUser, $smtpPass)

                $mail = New-Object System.Net.Mail.MailMessage
                $mail.From = New-Object System.Net.Mail.MailAddress($fromEmail, $fromName, [System.Text.Encoding]::UTF8)
                $mail.To.Add($toEmail)
                $mail.Subject = $subject
                $mail.SubjectEncoding = [System.Text.Encoding]::UTF8
                $mail.IsBodyHtml = $true
                $mail.Body = $htmlBody
                $mail.BodyEncoding = [System.Text.Encoding]::UTF8

                $smtp.Send($mail)
                $respObj = @{ success = $true; message = "Email delivered successfully to $toEmail" }
            } catch {
                $respObj = @{ success = $false; message = $_.Exception.Message }
            }

            $respJson = $respObj | ConvertTo-Json -Compress
            $respBytes = [System.Text.Encoding]::UTF8.GetBytes($respJson)
            $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($respBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nAccess-Control-Allow-Headers: *`r`nAccess-Control-Allow-Methods: GET, POST, OPTIONS`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($respBytes, 0, $respBytes.Length)
            $stream.Flush()
            $client.Close()
            continue
        }

        # API Endpoint: /api/send-sms
        if ($method -eq "POST" -and $url -eq "/api/send-sms") {
            $bodyStr = ReadBodyString $reader $contentLength
            $respObj = @{ success = $false; message = "Initial state" }
            try {
                $payload = $bodyStr | ConvertFrom-Json
                $phone = if ($payload.phone) { $payload.phone.ToString().Trim() } else { "" }
                $message = if ($payload.message) { $payload.message.ToString().Trim() } else { "" }
                $recipientName = if ($payload.recipientName) { $payload.recipientName.ToString().Trim() } else { "Unknown" }
                $recipientRole = if ($payload.recipientRole) { $payload.recipientRole.ToString().Trim() } else { "Customer" }
                $channel = if ($payload.channel) { $payload.channel.ToString().Trim() } else { "sms" }
                
                if (-not $phone) {
                    throw "Phone number is required!"
                }
                if (-not $message) {
                    throw "Message body cannot be empty!"
                }

                # Save log to sms_logs.json
                $smsLogPath = Join-Path $root "sms_logs.json"
                $logs = @()
                if (Test-Path $smsLogPath) {
                    try {
                        $existing = Get-Content -Raw -Encoding UTF8 $smsLogPath | ConvertFrom-Json
                        if ($existing -is [System.Collections.IEnumerable]) {
                            $logs = @($existing)
                        } else {
                            $logs = @($existing)
                        }
                    } catch { $logs = @() }
                }
                $newLog = @{
                    id = "SMS-" + [System.DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                    phone = $phone
                    recipientName = $recipientName
                    recipientRole = $recipientRole
                    message = $message
                    channel = $channel
                    timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                }
                $logs = @($newLog) + $logs
                if ($logs.Count -gt 200) { $logs = $logs[0..199] }
                $logs | ConvertTo-Json -Depth 5 | Set-Content -Path $smsLogPath -Encoding UTF8

                # Optional Gateway Forwarding
                if ($payload.gatewayUrl) {
                    try {
                        $gwBody = @{
                            to = $phone
                            text = $message
                            apiKey = $payload.gatewayApiKey
                        } | ConvertTo-Json
                        Invoke-RestMethod -Uri $payload.gatewayUrl -Method Post -Body $gwBody -ContentType "application/json" -TimeoutSec 10
                    } catch {}
                }

                $respObj = @{
                    success = $true
                    message = "SMS registered and sent successfully to $phone"
                    log = $newLog
                }
            } catch {
                $respObj = @{ success = $false; message = $_.Exception.Message }
            }

            $respJson = $respObj | ConvertTo-Json -Compress
            $respBytes = [System.Text.Encoding]::UTF8.GetBytes($respJson)
            $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($respBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nAccess-Control-Allow-Headers: *`r`nAccess-Control-Allow-Methods: GET, POST, OPTIONS`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($respBytes, 0, $respBytes.Length)
            $stream.Flush()
            $client.Close()
            continue
        }

        # API Endpoint: /api/get-sms-logs
        if ($method -eq "GET" -and $url.StartsWith("/api/get-sms-logs")) {
            $smsLogPath = Join-Path $root "sms_logs.json"
            $logs = @()
            if (Test-Path $smsLogPath) {
                try {
                    $existing = Get-Content -Raw -Encoding UTF8 $smsLogPath | ConvertFrom-Json
                    if ($existing -is [System.Collections.IEnumerable]) {
                        $logs = @($existing)
                    } else {
                        $logs = @($existing)
                    }
                } catch { $logs = @() }
            }
            $respJson = "[]"
            if ($logs.Count -gt 0) {
                $respJson = $logs | ConvertTo-Json -Depth 5 -Compress
            }
            $respBytes = [System.Text.Encoding]::UTF8.GetBytes($respJson)
            $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($respBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nAccess-Control-Allow-Headers: *`r`nAccess-Control-Allow-Methods: GET, POST, OPTIONS`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($respBytes, 0, $respBytes.Length)
            $stream.Flush()
            $client.Close()
            continue
        }

        # Static File Serving
        if ($url -eq "" -or $url -eq "/") { $url = "/index.html" }
        $url = [System.Uri]::UnescapeDataString($url)
        $relPath = $url.TrimStart("/").Replace("/", "\")
        $filePath = Join-Path $root $relPath

        if ([System.IO.File]::Exists($filePath)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`nAccess-Control-Allow-Origin: *`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($bytes, 0, $bytes.Length)
            $stream.Flush()
        } else {
            $msg = "404 Not Found: $url"
            $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($msg.Length)`r`nConnection: close`r`n`r`n$msg"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($bytes, 0, $bytes.Length)
            $stream.Flush()
        }
        $client.Close()
    } catch {
        if ($client) {
            try { $client.Close() } catch {}
        }
    }
}

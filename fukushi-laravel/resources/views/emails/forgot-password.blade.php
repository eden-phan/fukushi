<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>パスワードリセットのリクエスト - Fukushi</title>
    <style>
        body {
            font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            color: #374151;
            line-height: 1.6;
        }

        .container {
            max-width: 530px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 6px;
            border: 1px solid #ccc;
            overflow: hidden;
        }

        .header {
            background-color: #ffffff;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
        }

        .logo {
            font-size: 24px;
            font-weight: 600;
            color: #334155;
            margin-bottom: 10px;
        }

        .title {
            color: #334155;
            font-weight: 600;
            font-size: 28px;
            text-align: center;
            margin: 20px 0;
            padding-bottom: 15px;
        }

        .content-section {
            padding: 40px 40px 48px;
        }

        .section-label {
            display: block;
            margin-bottom: 20px;
            font-weight: 600;
            font-size: 18px;
            color: #334155;
        }

        .info-text {
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #334155;
            text-align: center;
        }

        .reset-button {
            display: inline-block;
            background-color: #0ea5e9;
            color: white;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 24px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            transition: background-color 0.2s;
        }

        .reset-button:hover {
            background-color: #0284c7;
        }

        .note {
            background-color: #f4f4f4;
            padding: 40px;
            border-radius: 0;
            font-size: 14px;
            color: #374151;
            margin: 30px 0 0;
            line-height: 1.5;
        }

        .note h3 {
            text-align: center;
            margin-bottom: 28px;
            font-size: 16px;
            font-weight: 600;
            color: #374151;
        }

        .note p {
            margin: 8px 0;
        }

        .footer {
            padding: 20px;
            background-color: #f9fafb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }

        .footer p {
            margin: 5px 0;
        }

        .button-container {
            text-align: center;
            margin: 30px 0;
        }

        @media only screen and (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 6px;
            }
            
            .content-section {
                padding: 16px 16px 24px;
            }
            
            .note {
                padding: 16px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="logo">Fukushi</div>
        </div>
        
        <div class="content-section">
            <div class="title">パスワード再設定</div>

            <p class="info-text">
                ご登録のメールアドレス宛にパスワード再設定の<br>
                リクエストを受信いたしました。<br>
                以下のボタンをクリックして、パスワードを再設定してください。
            </p>

            <div class="button-container">
                <a href="{{ $resetLink }}" class="reset-button">パスワードを再設定する</a>
            </div>

            <div class="note">
                <h3>メールが届かない場合</h3>
                <p>・ドメインからのメールアドレスが受信拒否設定に含まれていないか、メールが迷惑フォルダに振り分けされていないかをご確認ください。</p>
                <p>・このリクエストを行っていない場合は、このメールを無視してください。</p>
                <p>・このリンクは30分後に無効になります。</p>
            </div>
        </div>

        <div class="footer">
            <p>このメールはシステムより自動送信されています。</p>
            <p>© {{ date('Y') }} Fukushi. All Rights Reserved.</p>
        </div>
    </div>
</body>

</html>

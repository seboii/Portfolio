# Export the editable, text-based social artwork to a platform-friendly PNG.
# The website does not depend on PowerShell or System.Drawing at runtime.
Add-Type -AssemblyName System.Drawing
$portfolioRoot = Split-Path -Parent $PSScriptRoot
$bitmap = [System.Drawing.Bitmap]::new(1200, 630)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#151714'))
$foreground = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#f2f0e8'))
$accent = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#ddf56f'))
$rule = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#47503d'), 1)
$small = [System.Drawing.Font]::new('Arial', 21, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$large = [System.Drawing.Font]::new('Arial', 82, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$body = [System.Drawing.Font]::new('Arial', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
try {
  $graphics.DrawLine($rule, 64, 82, 1136, 82)
  $graphics.DrawLine($rule, 64, 548, 1136, 548)
  $graphics.FillEllipse($accent, 1081, 40, 16, 16)
  $graphics.DrawString('SS / ENGINEERING IN MOTION', $small, $foreground, 64, 32)
  $graphics.DrawString('Shakhobiddin', $large, $foreground, 60, 153)
  $graphics.DrawString('Shamshiev', $large, $foreground, 60, 248)
  $graphics.DrawString('Computer Engineer | Full-Stack Developer', $body, $foreground, 64, 380)
  $graphics.DrawString('UI → API → DATA → DELIVERY', $small, $accent, 64, 470)
  $graphics.DrawString('İstanbul, Türkiye', $small, $foreground, 64, 562)
  $bitmap.Save((Join-Path $portfolioRoot 'public\share-image.png'), [System.Drawing.Imaging.ImageFormat]::Png)
}
finally {
  $small.Dispose()
  $large.Dispose()
  $body.Dispose()
  $foreground.Dispose()
  $accent.Dispose()
  $rule.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

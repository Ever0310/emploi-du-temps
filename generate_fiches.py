#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère les fiches musicales pour CM1 — musiques de films"""

import qrcode
import io
import base64
import os
import subprocess

# ============================================================
# DONNÉES DES 3 FICHES
# ============================================================

FICHES = [
    {
        'id': 1,
        'film': 'Star Wars',
        'morceau': 'La Marche Impériale',
        'compositeur_nom': 'John Williams',
        'youtube_url': 'https://www.youtube.com/results?search_query=star+wars+marche+imperiale+john+williams',
        'compositeur_texte': (
            'John Williams est né en 1932 à New York. '
            "C'est l'un des compositeurs de musiques de films les plus célèbres au monde ! "
            'Il a reçu 5 Oscars au cours de sa carrière et a été nommé 54 fois. '
            "Il a aussi composé la musique de Harry Potter, d'Indiana Jones, "
            "de Jurassic Park et de Schindler's List."
        ),
        'film_texte': (
            'Star Wars (La Guerre des Étoiles) est une saga de science-fiction créée par George Lucas. '
            'Le premier film est sorti en 1977. '
            "La Marche Impériale est la musique du terrible Dark Vador, le grand méchant de la saga ! "
            "Elle apparaît pour la première fois dans « L'Empire contre-attaque » en 1980. "
            'Il y a 9 films principaux dans la saga Star Wars.'
        ),
    },
    {
        'id': 2,
        'film': 'Indiana Jones',
        'morceau': 'Raiders March',
        'compositeur_nom': 'John Williams',
        'youtube_url': 'https://www.youtube.com/results?search_query=indiana+jones+raiders+march+john+williams',
        'compositeur_texte': (
            'John Williams est né en 1932 à New York. '
            "C'est l'un des compositeurs les plus talentueux d'Hollywood ! "
            "En plus d'Indiana Jones, il a composé Star Wars, Harry Potter, "
            "Jurassic Park, E.T. et bien d'autres encore. "
            'Il a reçu 5 Oscars dans sa carrière.'
        ),
        'film_texte': (
            "Les Aventuriers de l'Arche Perdue (1981) est le premier film "
            "de la saga Indiana Jones, réalisé par Steven Spielberg. "
            "Le héros, Indiana Jones (joué par Harrison Ford), est un archéologue aventurier. "
            "Il part à la recherche de l'Arche d'Alliance, un objet mystérieux et très puissant. "
            "C'est une aventure pleine d'action ! Il y a 5 films dans la saga."
        ),
    },
    {
        'id': 3,
        'film': 'Pirates des Caraïbes',
        'morceau': "He's a Pirate",
        'compositeur_nom': 'Klaus Badelt & Hans Zimmer',
        'youtube_url': 'https://www.youtube.com/results?search_query=pirates+caraibes+hes+a+pirate+hans+zimmer',
        'compositeur_texte': (
            "Klaus Badelt a composé « He's a Pirate » avec l'aide de Hans Zimmer. "
            'Hans Zimmer est né en 1957 en Allemagne. '
            "C'est l'un des compositeurs les plus connus d'Hollywood. "
            'Il a aussi composé la musique du Roi Lion, Interstellar et Gladiator. '
            'Il a reçu 2 Oscars.'
        ),
        'film_texte': (
            "Pirates des Caraïbes : La Malédiction du Black Pearl (2003) "
            "est une aventure de pirates réalisée par Gore Verbinski. "
            "Le capitaine Jack Sparrow (joué par Johnny Depp) doit récupérer "
            "son bateau, le Black Pearl, volé par le capitaine Barbossa. "
            "C'est une aventure pleine d'humour, de magie et de batailles navales ! "
            'Il y a 5 films dans la saga.'
        ),
    },
]

# ============================================================
# QR CODE
# ============================================================

def make_qr_b64(url):
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color='#1a1a1a', back_color='white')
    buf = io.BytesIO()
    img.save(buf, 'PNG')
    return base64.b64encode(buf.getvalue()).decode()

# ============================================================
# TEMPLATE HTML
# ============================================================

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>{film} — {morceau}</title>
<style>
  @page {{
    size: A4;
    margin: 1.2cm 1.5cm;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    color: #2c3e50;
    background: white;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}

  /* HEADER */
  .header {{
    background: linear-gradient(135deg, #1E3A5F 0%, #2874A6 100%);
    color: white;
    padding: 14px 20px;
    border-radius: 12px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 14px;
  }}
  .header-note {{
    font-size: 36px;
    line-height: 1;
    flex-shrink: 0;
  }}
  .header-sub {{
    font-size: 10px;
    color: #AED6F1;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }}
  .header-title {{
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 4px;
    line-height: 1.2;
  }}
  .header-composer {{
    font-size: 13px;
    color: #D6EAF8;
  }}

  /* LIGNE DU MILIEU */
  .mid-row {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }}

  /* QR BOX */
  .qr-box {{
    background: #EBF5FB;
    border: 2px solid #5DADE2;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 18px 12px 14px;
    gap: 10px;
  }}
  .qr-box img {{
    width: 155px;
    height: 155px;
    display: block;
    border: 3px solid #2E86C1;
    border-radius: 6px;
  }}
  .qr-label {{
    font-size: 12px;
    font-weight: 700;
    color: #1A5276;
    text-align: center;
  }}

  /* SMILEY BOX */
  .smiley-box {{
    background: #FEF9E7;
    border: 2px solid #F4D03F;
    border-radius: 12px;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
  }}
  .smiley-title {{
    font-size: 18px;
    font-weight: 800;
    color: #D35400;
  }}
  .smileys {{
    display: flex;
    gap: 22px;
    justify-content: center;
    align-items: flex-start;
  }}
  .smiley-item {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }}
  .smiley-circle {{
    width: 64px;
    height: 64px;
    border: 2.5px dashed #C8C8C8;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    line-height: 1;
    background: white;
  }}
  .smiley-label {{
    font-size: 9.5px;
    color: #7F8C8D;
    text-align: center;
    width: 68px;
    line-height: 1.3;
  }}
  .smiley-instruction {{
    font-size: 10px;
    color: #95A5A6;
    font-style: italic;
  }}

  /* INFO BOXES */
  .info-box {{
    border-radius: 12px;
    margin-bottom: 14px;
    overflow: hidden;
  }}
  .info-box:last-child {{ margin-bottom: 0; }}
  .info-box-header {{
    padding: 9px 16px;
    font-size: 13px;
    font-weight: 700;
    color: white;
  }}
  .info-box-content {{
    padding: 13px 16px;
    font-size: 11.5px;
    line-height: 1.7;
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
    border-bottom: 2px solid transparent;
    border-radius: 0 0 12px 12px;
  }}

  /* COMPOSITEUR — orange */
  .composer-box .info-box-header {{
    background: linear-gradient(90deg, #CA6F1E, #E67E22);
  }}
  .composer-box .info-box-content {{
    background: #FEF5E4;
    border-color: #E67E22;
  }}

  /* FILM — vert */
  .film-box .info-box-header {{
    background: linear-gradient(90deg, #1E8449, #27AE60);
  }}
  .film-box .info-box-content {{
    background: #EAFAF1;
    border-color: #27AE60;
  }}

  .footer {{
    text-align: center;
    font-size: 8px;
    color: #BDC3C7;
    margin-top: 10px;
  }}
</style>
</head>
<body>

  <div class="header">
    <div class="header-note">&#9835;</div>
    <div>
      <div class="header-sub">Écoutes musicales &mdash; musiques de films</div>
      <div class="header-title">{film} &mdash; <em>{morceau}</em></div>
      <div class="header-composer">{compositeur_nom}</div>
    </div>
  </div>

  <div class="mid-row">

    <div class="qr-box">
      <img src="data:image/png;base64,{qr_b64}" alt="QR Code écoute">
      <div class="qr-label">&#128241; Scanne pour écouter !</div>
    </div>

    <div class="smiley-box">
      <div class="smiley-title">J&apos;ai aimé&nbsp;?</div>
      <div class="smileys">
        <div class="smiley-item">
          <div class="smiley-circle">&#128522;</div>
          <div class="smiley-label">J&apos;ai adoré&nbsp;!</div>
        </div>
        <div class="smiley-item">
          <div class="smiley-circle">&#128528;</div>
          <div class="smiley-label">Pas mal&hellip;</div>
        </div>
        <div class="smiley-item">
          <div class="smiley-circle">&#128533;</div>
          <div class="smiley-label">Pas aimé</div>
        </div>
      </div>
      <div class="smiley-instruction">&#8594; Entoure le bon smiley</div>
    </div>

  </div>

  <div class="info-box composer-box">
    <div class="info-box-header">&#127932; Le compositeur : {compositeur_nom}</div>
    <div class="info-box-content">{compositeur_texte}</div>
  </div>

  <div class="info-box film-box">
    <div class="info-box-header">&#127916; Le film : {film}</div>
    <div class="info-box-content">{film_texte}</div>
  </div>

  <div class="footer">Écoutes musicales : musiques de films &mdash; Fiche {id}</div>

</body>
</html>'''

# ============================================================
# CONVERSION PDF VIA CHROME
# ============================================================

def html_to_pdf_chrome(html_path, pdf_path):
    chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    if not os.path.exists(chrome):
        return False
    try:
        result = subprocess.run([
            chrome,
            '--headless',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            f'--print-to-pdf={os.path.abspath(pdf_path)}',
            '--print-to-pdf-no-header',
            '--no-margins',
            f'file://{os.path.abspath(html_path)}'
        ], capture_output=True, timeout=30)
        return result.returncode == 0 and os.path.exists(pdf_path)
    except Exception as e:
        print(f'  Chrome error: {e}')
        return False

# ============================================================
# MAIN
# ============================================================

if __name__ == '__main__':
    output_dir = os.path.join(os.path.dirname(__file__), 'fiches_musicales')
    os.makedirs(output_dir, exist_ok=True)

    for fiche in FICHES:
        print(f"\nFiche {fiche['id']} : {fiche['film']}")

        qr_b64 = make_qr_b64(fiche['youtube_url'])
        html_content = HTML_TEMPLATE.format(qr_b64=qr_b64, **fiche)

        safe = ''.join(c if c.isalnum() or c == ' ' else '' for c in fiche['film']).strip().replace(' ', '_')
        base_name = f"fiche_{fiche['id']:02d}_{safe}"
        html_path = os.path.join(output_dir, base_name + '.html')
        pdf_path  = os.path.join(output_dir, base_name + '.pdf')

        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f'  HTML : {html_path}')

        if html_to_pdf_chrome(html_path, pdf_path):
            print(f'  PDF  : {pdf_path}')
        else:
            print(f'  PDF  : conversion impossible — ouvre le HTML dans Chrome et fais Ctrl+P > Enregistrer en PDF')

    print('\nTerminé !')

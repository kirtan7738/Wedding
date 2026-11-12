"""Export every embedded image from the family's card PDF.

Usage: python -I scripts/extract-pdf.py <pdf> <outdir>
Writes p<page>-x<xref>-<w>x<h>.<ext> (+ a separate -smask.png when the image has an alpha mask).
"""
import os
import sys

import pymupdf


def main(pdf_path: str, outdir: str) -> None:
    os.makedirs(outdir, exist_ok=True)
    doc = pymupdf.open(pdf_path)
    seen = set()
    for page_index, page in enumerate(doc, start=1):
        for img in page.get_images(full=True):
            xref, smask = img[0], img[1]
            if xref in seen:
                continue
            seen.add(xref)
            info = doc.extract_image(xref)
            name = f"p{page_index}-x{xref}-{info['width']}x{info['height']}"
            with open(os.path.join(outdir, f"{name}.{info['ext']}"), "wb") as fh:
                fh.write(info["image"])
            if smask:
                pix = pymupdf.Pixmap(doc.extract_image(smask)["image"])
                pix.save(os.path.join(outdir, f"{name}-smask.png"))
            print(name, info["ext"], "smask" if smask else "")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])

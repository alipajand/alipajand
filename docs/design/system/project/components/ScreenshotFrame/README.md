# ScreenshotFrame

A hairline window around a product screenshot, with a mono title bar (ring dots, the product host and the caption lead) and a caption below it.

- The image is a button that opens the full-size screenshot in a `<dialog>`. Escape and the backdrop both close it.
- The caption lead is bold, followed by the body, both from `interfaceEvidence`.
- The case study hero tilts back about 14° and flattens over the first 55% of a screen of scroll. It also follows the pointer by a few degrees.
- Images are lazy-loaded except the hero, and always carry their real alt text.

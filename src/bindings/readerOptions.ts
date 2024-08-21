import type { ZXingModule } from "../core.js";
import {
  type ReadInputBarcodeFormat,
  formatsToString,
} from "./barcodeFormat.js";
import { type Binarizer, binarizerToZXingEnum } from "./binarizer.js";
import { type CharacterSet, characterSetToZXingEnum } from "./characterSet.js";
import {
  type EanAddOnSymbol,
  eanAddOnSymbolToZXingEnum,
} from "./eanAddOnSymbol.js";
import type { ZXingEnum } from "./enum.js";
import { type TextMode, textModeToZXingEnum } from "./textMode.js";

/**
 * @internal
 */
export interface ZXingReaderOptions {
  formats: string;
  /**
   * Spend more time to try to find a barcode. Optimize for accuracy, not speed.
   *
   * @defaultValue `true`
   */
  tryHarder: boolean;
  /**
   * Try detecting code in 90, 180 and 270 degree rotated images.
   *
   * @defaultValue `true`
   */
  tryRotate: boolean;
  /**
   * Try detecting inverted (reversed reflectance) codes if the format allows for those.
   *
   * @defaultValue `true`
   */
  tryInvert: boolean;
  /**
   * Try detecting code in downscaled images (depending on image size).
   *
   * @defaultValue `true`
   * @see {@link downscaleFactor | `downscaleFactor`} {@link downscaleThreshold | `downscaleThreshold`}
   */
  tryDownscale: boolean;
  binarizer: ZXingEnum;
  /**
   * Set to `true` if the input contains nothing but a single perfectly aligned barcode (usually
   * generated images).
   *
   * @defaultValue `false`
   */
  isPure: boolean;
  /**
   * Image size ( min(width, height) ) threshold at which to start downscaled scanning **WARNING**:
   * this API is experimental and may change / disappear
   *
   * @defaultValue `500`
   * @experimental
   * @see {@link tryDownscale | `tryDownscale`} {@link downscaleFactor | `downscaleFactor`}
   */
  downscaleThreshold: number;
  /**
   * Scale factor to use during downscaling, meaningful values are `2`, `3` and `4`. **WARNING**:
   * this API is experimental and may change / disappear
   *
   * @defaultValue `3`
   * @experimental
   * @see {@link tryDownscale | `tryDownscale`} {@link downscaleThreshold | `downscaleThreshold`}
   */
  downscaleFactor: number;
  /**
   * The number of scan lines in a linear barcode that have to be equal to accept the result.
   *
   * @defaultValue `2`
   */
  minLineCount: number;
  /**
   * The maximum number of symbols / barcodes to detect / look for in the image. The upper limit of
   * this number is 255.
   *
   * @defaultValue `255`
   */
  maxNumberOfSymbols: number;
  /**
   * If `true`, the Code-39 reader will try to read extended mode.
   *
   * @defaultValue `false`
   */
  tryCode39ExtendedMode: boolean;
  /**
   * Assume Code-39 codes employ a check digit and validate it.
   *
   * @defaultValue `false`
   * @deprecated upstream
   */
  validateCode39CheckSum: boolean;
  /**
   * Assume ITF codes employ a GS1 check digit and validate it.
   *
   * @defaultValue `false`
   * @deprecated upstream
   */
  validateITFCheckSum: boolean;
  /**
   * If `true`, return the start and end chars in a Codabar barcode instead of stripping them.
   *
   * @defaultValue `false`
   * @deprecated upstream
   */
  returnCodabarStartEnd: boolean;
  /**
   * If `true`, return the barcodes with errors as well (e.g. checksum errors).
   *
   * @defaultValue `false`
   */
  returnErrors: boolean;
  eanAddOnSymbol: ZXingEnum;
  textMode: ZXingEnum;
  characterSet: ZXingEnum;
}

/**
 * Reader options for reading barcodes.
 */
export interface ReaderOptions
  extends Partial<
    Omit<
      ZXingReaderOptions,
      "formats" | "binarizer" | "eanAddOnSymbol" | "textMode" | "characterSet"
    >
  > {
  /**
   * A set of {@link ReadInputBarcodeFormat | `ReadInputBarcodeFormat`}s that should be searched for.
   * An empty list `[]` indicates all supported formats.
   *
   * Supported values in this list are: `"Aztec"`, `"Codabar"`, `"Code128"`, `"Code39"`, `"Code93"`,
   * `"DataBar"`, `"DataBarExpanded"`, `"DataMatrix"`, `"DXFilmEdge"`, `"EAN-13"`, `"EAN-8"`,
   * `"ITF"`, `"Linear-Codes"`, `"Matrix-Codes"`, `"MaxiCode"`, `"MicroQRCode"`, `"PDF417"`,
   * `"QRCode"`, `"rMQRCode"`, `"UPC-A"`, `"UPC-E"`
   *
   * @defaultValue `[]`
   */
  formats?: ReadInputBarcodeFormat[];
  /**
   * Algorithm to use for the grayscale to binary transformation. The difference is how to get to a
   * threshold value T which results in a bit value R = L <= T.
   *
   * - `"LocalAverage"`
   *
   *   T = average of neighboring pixels for matrix and GlobalHistogram for linear
   * - `"GlobalHistogram"`
   *
   *   T = valley between the 2 largest peaks in the histogram (per line in linear case)
   * - `"FixedThreshold"`
   *
   *   T = 127
   * - `"BoolCast"`
   *
   *   T = 0, fastest possible
   *
   * @defaultValue `"LocalAverage"`
   */
  binarizer?: Binarizer;
  /**
   * Specify whether to ignore, read or require EAN-2 / 5 add-on symbols while scanning EAN / UPC
   * codes.
   *
   * - `"Ignore"`
   *
   *   Ignore any Add-On symbol during read / scan
   * - `"Read"`
   *
   *   Read EAN-2 / EAN-5 Add-On symbol if found
   * - `"Require"`
   *
   *   Require EAN-2 / EAN-5 Add-On symbol to be present
   *
   * @defaultValue `"Read"`
   */
  eanAddOnSymbol?: EanAddOnSymbol;
  /**
   * Specifies the `TextMode` that controls the result of
   * {@link ReadResult.text | `ReadResult.text`}.
   *
   * - `"Plain"`
   *
   *   {@link ReadResult.bytes | `ReadResult.bytes`} transcoded to unicode based on ECI info or guessed
   *   character set
   * - `"ECI"`
   *
   *   Standard content following the ECI protocol with every character set ECI segment transcoded to
   *   unicode
   * - `"HRI"`
   *
   *   Human Readable Interpretation (dependent on the ContentType)
   * - `"Hex"`
   *
   *   {@link ReadResult.bytes | `ReadResult.bytes`} transcoded to ASCII string of HEX values
   * - `"Escaped"`
   *
   *   Escape non-graphical characters in angle brackets (e.g. ASCII `29` will be transcoded to
   *   `"<GS>"`)
   *
   * @defaultValue `"Plain"`
   */
  textMode?: TextMode;
  /**
   * Character set to use (when applicable). If this is set to `"Unknown"`, auto-detecting will be
   * used.
   *
   * @defaultValue `"Unknown"`
   */
  characterSet?: CharacterSet;
}

export type ResolvedReaderOptions = Required<ReaderOptions>;

export const defaultReaderOptions: ResolvedReaderOptions = {
  formats: [],
  tryHarder: true,
  tryRotate: true,
  tryInvert: true,
  tryDownscale: true,
  binarizer: "LocalAverage",
  isPure: false,
  downscaleFactor: 3,
  downscaleThreshold: 500,
  minLineCount: 2,
  maxNumberOfSymbols: 255,
  tryCode39ExtendedMode: false,
  validateCode39CheckSum: false,
  validateITFCheckSum: false,
  returnCodabarStartEnd: false,
  returnErrors: false,
  eanAddOnSymbol: "Read",
  textMode: "Plain",
  characterSet: "Unknown",
};

export function resolveReaderOptions(
  readerOptions?: ReaderOptions,
): ResolvedReaderOptions {
  return {
    formats: readerOptions?.formats ?? defaultReaderOptions.formats,
    tryHarder: readerOptions?.tryHarder ?? defaultReaderOptions.tryHarder,
    tryRotate: readerOptions?.tryRotate ?? defaultReaderOptions.tryRotate,
    tryInvert: readerOptions?.tryInvert ?? defaultReaderOptions.tryInvert,
    tryDownscale:
      readerOptions?.tryDownscale ?? defaultReaderOptions.tryDownscale,
    binarizer: readerOptions?.binarizer ?? defaultReaderOptions.binarizer,
    isPure: readerOptions?.isPure ?? defaultReaderOptions.isPure,
    downscaleFactor:
      readerOptions?.downscaleFactor ?? defaultReaderOptions.downscaleFactor,
    downscaleThreshold:
      readerOptions?.downscaleThreshold ??
      defaultReaderOptions.downscaleThreshold,
    minLineCount:
      readerOptions?.minLineCount ?? defaultReaderOptions.minLineCount,
    maxNumberOfSymbols:
      readerOptions?.maxNumberOfSymbols ??
      defaultReaderOptions.maxNumberOfSymbols,
    tryCode39ExtendedMode:
      readerOptions?.tryCode39ExtendedMode ??
      defaultReaderOptions.tryCode39ExtendedMode,
    validateCode39CheckSum:
      readerOptions?.validateCode39CheckSum ??
      defaultReaderOptions.validateCode39CheckSum,
    validateITFCheckSum:
      readerOptions?.validateITFCheckSum ??
      defaultReaderOptions.validateITFCheckSum,
    returnCodabarStartEnd:
      readerOptions?.returnCodabarStartEnd ??
      defaultReaderOptions.returnCodabarStartEnd,
    returnErrors:
      readerOptions?.returnErrors ?? defaultReaderOptions.returnErrors,
    eanAddOnSymbol:
      readerOptions?.eanAddOnSymbol ?? defaultReaderOptions.eanAddOnSymbol,
    textMode: readerOptions?.textMode ?? defaultReaderOptions.textMode,
    characterSet:
      readerOptions?.characterSet ?? defaultReaderOptions.characterSet,
  };
}

export function readerOptionsToZXingReaderOptions<T extends "reader" | "full">(
  zxingModule: ZXingModule<T>,
  readerOptions: ResolvedReaderOptions,
): ZXingReaderOptions {
  return Object.assign(readerOptions, {
    formats: formatsToString(readerOptions.formats),
    binarizer: binarizerToZXingEnum(zxingModule, readerOptions.binarizer),
    eanAddOnSymbol: eanAddOnSymbolToZXingEnum(
      zxingModule,
      readerOptions.eanAddOnSymbol,
    ),
    textMode: textModeToZXingEnum(zxingModule, readerOptions.textMode),
    characterSet: characterSetToZXingEnum(
      zxingModule,
      readerOptions.characterSet,
    ),
  });
}

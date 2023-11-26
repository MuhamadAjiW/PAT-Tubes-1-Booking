import { App } from "./src/app";
import { SignatureUtil } from "./src/utils/signature-utils";

// const app = new App;
// app.run();

console.log(SignatureUtil.generateSignature("test", SignatureUtil.PDFExpiry));
SignatureUtil.verifySignature("V33tMcTqq29FNeDxlQtd41wColf1lZ_AjsaDW_495ens2-LzgNvH_QCPNGTMtznaLZ8Gcy24kgJCxMGf956_YA");

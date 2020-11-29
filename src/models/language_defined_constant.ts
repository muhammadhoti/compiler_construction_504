import { LanguageDefinedConstantTypes } from "../helpers/enums";

export class LanguageDefinedConstant {
    type : LanguageDefinedConstantTypes;
    classPart : string = "";
    valuePart : string = "";
}
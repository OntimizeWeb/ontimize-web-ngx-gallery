export class Util {
  static getMimeType(fileSource: string): string {
    let base64ContentArray = fileSource.split(",")
    const regExp = /^\s*data:([a-z]+\/[a-z\*]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?\s*$/i;
    if (base64ContentArray[0].match(regExp) != null) {
      return base64ContentArray[0].match(regExp)[1];
    }
    else return null;
  }
}
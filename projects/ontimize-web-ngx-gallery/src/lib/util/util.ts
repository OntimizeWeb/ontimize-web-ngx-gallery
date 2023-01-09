export class Util {
  static isUrl(fileSource: string): boolean {
    const regExpData = /^\s*data:/i;
    let base64ContentArray = fileSource.split(",")
    if (base64ContentArray[0].match(regExpData) != null) {
      return false;
    }
    else { return true }
  }

  /**
  * Determines whether url absolute is
  * @param url
  * @returns
  */
  static isUrlAbsolute(url: string): boolean {
    return url.search(/^http[s]?\:\/\//) > -1;
  }

  static getMimeType(fileSource: string): string {
    const regExp = /^\s*data:([a-z]+\/[a-z\*]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?\s*$/i;
    let base64ContentArray = fileSource.split(",")
    return base64ContentArray[0].match(regExp)[1];
  }
}
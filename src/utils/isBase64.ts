export default function isBase64(str: string): boolean {
  const base64regex = new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$');
  return base64regex.test(str);
}

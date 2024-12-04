export function TryAtob(b: string): string {
  try {
    return atob(b);
  } catch {
    return "";
  }
}

export function tryParseInt(input: string): string | number {
  try {
    const parsed = parseInt(input);

    return Number.isNaN(parsed) || !parsed ? input : parsed;
  } catch {
    return input;
  }
}

export function tryParseFloat(input: any): string | number {
  try {
    const parsed = parseFloat(input);

    return Number.isNaN(parsed) || !parsed ? input : parsed;
  } catch {
    return input;
  }
}

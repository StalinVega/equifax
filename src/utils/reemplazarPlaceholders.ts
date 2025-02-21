

/**
 * Reemplaza los placeholders en una plantilla con los datos proporcionados.
 * @param plantilla El texto de la plantilla.
 * @param datos Un objeto con los datos del usuario.
 * @returns El texto con los placeholders reemplazados.
 */
export function reemplazarPlaceholders(plantilla: string, datos: Record<string, string>): string {
    return plantilla.replace(/\{\{(\w+)\}\}/g, (_, key) => datos[key] || '');
}
export function parseTemplate (template: string, map: any) {
  return template.replace(/\$\{[^}]+\}/g, match =>
    match
      .slice(2, -1)
      .trim()
      .split('.')
      .reduce(
        (searchObject, key) => searchObject[key] || match,
        map
      )
  )
}

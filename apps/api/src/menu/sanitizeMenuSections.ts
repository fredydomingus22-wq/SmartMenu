function sanitizeMenuSections(sections: any[]) {
  return sections.map((s) => ({
    id: s.id,
    type: s.type,
    name: s.name,
    isActive: s.isActive,
    config: s.config,
  }));
}

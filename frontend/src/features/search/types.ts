export interface SearchResult { type: 'movie' | 'event' | 'venue'; id: string; title: string; slug: string; imageUrl?: string; meta?: string; }

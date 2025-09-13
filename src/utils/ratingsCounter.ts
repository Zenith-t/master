// Dynamic ratings counter utility
export class RatingsCounter {
  private static readonly MIN_BASE = 2056;
  private static readonly MAX_BASE = 9999;
  private static readonly DAILY_GROWTH_MIN = 2;
  private static readonly DAILY_GROWTH_MAX = 10;
  
  // Get a consistent random number for a given ID
  private static getSeededRandom(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  // Get base rating count for an item
  private static getBaseCount(id: string): number {
    const seed = this.getSeededRandom(id);
    const range = this.MAX_BASE - this.MIN_BASE;
    return this.MIN_BASE + (seed % range);
  }
  
  // Get days since epoch (for consistent daily growth)
  private static getDaysSinceEpoch(): number {
    const now = new Date();
    const epoch = new Date('2024-01-01'); // Start date
    const diffTime = Math.abs(now.getTime() - epoch.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
  
  // Get daily growth for an item
  private static getDailyGrowth(id: string, days: number): number {
    let totalGrowth = 0;
    
    for (let day = 0; day < days; day++) {
      const daySeed = this.getSeededRandom(id + day.toString());
      const growthRange = this.DAILY_GROWTH_MAX - this.DAILY_GROWTH_MIN;
      const dayGrowth = this.DAILY_GROWTH_MIN + (daySeed % growthRange);
      totalGrowth += dayGrowth;
    }
    
    return totalGrowth;
  }
  
  // Get current rating count for an item
  public static getRatingCount(id: string): number {
    const baseCount = this.getBaseCount(id);
    const days = this.getDaysSinceEpoch();
    const growth = this.getDailyGrowth(id, days);
    
    return baseCount + growth;
  }
  
  // Format rating count with commas for large numbers
  public static formatCount(count: number): string {
    return count.toLocaleString();
  }
}
export const CacheMethod = (duration: number) => {
    const cache = new Map<string, any>();
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const key = `${propertyKey}_${args.join('_')}`;
            if (cache.has(key)) {
                return cache.get(key);
            }

            const result = originalMethod.apply(this, args);
            cache.set(key, result);
            
            console.log('Cached', key.split('_')[1]);

            setTimeout(() => cache.delete(key), duration);
            return result;
        };
    };
}
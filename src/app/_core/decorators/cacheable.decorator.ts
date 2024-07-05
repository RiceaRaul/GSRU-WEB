
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

type CacheValue<T> = {value: T, timestamp: number, observable:boolean};

export function Cacheable<T>(cacheDuration: number = 60000){
    return function(target: T, propertyKey: string, descriptor: PropertyDescriptor){
        const originalMethod = descriptor.value;
        const cache = new Map<string,CacheValue<T>>();

        //eslint-disable-next-line
        descriptor.value = function(...args: any[]){
            const cacheKey = JSON.stringify(args);
            if(cache.has(cacheKey)){
                const cachedValue = cache.get(cacheKey);
                if(Date.now() - cachedValue.timestamp < cacheDuration){
                    if(cachedValue.observable){
                        return of(cachedValue.value)
                    }
                    return cachedValue.value;
                }
            }
            const result = originalMethod.apply(this, args);
            if(result instanceof Observable){
                return result.pipe(
                    tap(result => {
                        cache.set(cacheKey, {value: result, timestamp: Date.now(), observable: true})
                    })
                );
            }
            cache.set(cacheKey, {value: result, timestamp: Date.now(), observable: false});
            return result;
        }
    }
}

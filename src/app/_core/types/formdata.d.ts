export {};

declare global{
    interface FormData {
        /**
         * Appends an object to the FormData object
         * @param key The key to append the object to
         * @param value The value of the object
         * @param dateFormatter The date format to use when appending dates ex "YYYY-MM-DDTHH:mm:ss"
        */
        appendObject<T>(key:string, value: Record<string,T>): void;
        /**
         * Appends an array to the FormData object
         * @param key The key to append the array to
         * @param value The value of the array
         * @param dateFormatter The date format to use when appending dates ex "YYYY-MM-DDTHH:mm:ss"
         */
        appendArray<T>(key:string, value: T[]): void;
    }
}

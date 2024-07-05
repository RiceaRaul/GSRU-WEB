import moment from 'moment';

const PRIMITIVE_TYPES = ['string', 'number', 'boolean'];
const originalAppend = FormData.prototype.append;

const appendObject = function<T>(key:string, value: Record<string,T>, dateFormatter?:string) {
    if(value === null || value === undefined){
        return
    }
    for(const valueKey in value){
        if(Object.prototype.hasOwnProperty.call(value, valueKey)){
            const objectValue = value[valueKey];
            if(Array.isArray(objectValue)){
                FormData.prototype.appendArray.call(this,`${key}.${valueKey}`, objectValue);
            }
            else{
                if(objectValue === null || objectValue === undefined){
                    continue;
                }
                if(typeof objectValue !== 'string'){
                    if(objectValue instanceof Date){
                        originalAppend.call(this,`${key}.${valueKey}`, moment(objectValue).format(dateFormatter ?? "YYYY-MM-DDTHH:mm:ss"));
                    }
                    originalAppend.call(this,`${key}.${valueKey}`, objectValue.toString());
                }
                else{
                    originalAppend.call(this,`${key}.${valueKey}`, objectValue);
                }
            }
        }
    }
};


const appendArray = function<T>(key:string, value: T[], dateFormatter?:string) {
    if(value == null || value == undefined || !value.length){
        return;
    }

    if(PRIMITIVE_TYPES.includes(typeof value[0])){
        for(let i = 0; i < value.length; i++){
            originalAppend.call(this, `${key}[${i}]`, value[i].toString());
        }
    }

    for(let i = 0; i < value.length; i++){
        if(typeof value[i] === 'object'){
            this.appendObject(`${key}[${i}]`, value[i], dateFormatter);
        }
    }
}

FormData.prototype.appendObject = appendObject;
FormData.prototype.appendArray = appendArray;

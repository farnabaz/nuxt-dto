export interface PropMap {
    path?: string;
    type?: (new() => any) | [any];
    required?: boolean;
}

export interface PropsMap {
    [key: string]: PropMap;
}

export interface ModelData {
    props?: PropsMap;
}

export function Model(data: ModelData) {
    return function mapperDecorator<T extends new(...args: any[]) => {}>(constructor: T) {
        const map = Object.assign({}, constructor.prototype.__map || {}, data.props || {});
        constructor.prototype.toJSON = function toJSON() {
            return Object.keys(map).reduce((json: {[key: string]: any}, key: string) => {
                json[key] = this[key];
                return json;
            }, {});
        };
        constructor.prototype.__map = map;
        return constructor;
    };
}

export function Prop(map: PropMap) {
    return function mapperDecorator(target: any, propertyKey: string) {
        const mapper = target.constructor.prototype.__map || {};

        mapper[propertyKey] = map;
        target.constructor.prototype.__map = mapper;
    };
}

export interface IJsonMetaData<T> {
    name?: string;
    clazz?: new() => T;
}

export default function mapModel<T>(type: (new() => T) | [any], jsonObject: any): T {
    if (!jsonObject) {
        return;
    }
    if (isArray(type)) {
        if (isArray(jsonObject)) {
            const c = type as any;
            const itemClass = (c as Array<new() => T>)[0];
            return jsonObject.map((item: any) => mapModel(itemClass, item));
        }
        return;
    }
    const clazz = type as (new(arg?: any) => T);
    if (typeof clazz.prototype.__map === "undefined" && typeof clazz === "function") {
        return new clazz(jsonObject);
    }
    const data: PropsMap = clazz.prototype.__map || {};
    const obj = new clazz();

    Object.keys(data).forEach((key) => {
        const map = data[key];
        const propertyKey = map.path || key;
        const value = jsonObject[propertyKey];

        if (map.required && value === undefined) {
            throw new Error(`Cannot find property '${propertyKey}' from ${clazz.name}`);
        }

        if (!map.type || isPrimitive(map.type)) {
            Object.assign(obj, {[key]: value});
        } else if (isArray(map.type)) {
            if (isArray(value)) {
                const itemClass = (map.type as Array<new() => T>)[0];
                Object.assign(obj, {[key]: value.map((item: any) => mapModel(itemClass, item))});
            } else {
                Object.assign(obj, {[key]: []});
            }
        } else {
            Object.assign(obj, {[key]: mapModel(map.type as new() => T, value)});
        }
    });
    return obj;
}
export function isPrimitive(obj: any) {
    switch (typeof obj) {
        case "string":
        case "number":
        case "boolean":
        case "undefined":
            return true;
        case "function":
            return !!(obj.name === "String" ||
                obj.name === "Number" ||
                obj.name === "Boolean");
    }
    return !!(obj instanceof String || obj === String ||
    obj instanceof Number || obj === Number ||
    obj instanceof Boolean || obj === Boolean || obj === undefined);
}

export function isArray(object: any) {
    if (object === Array) {
        return true;
    } else if (typeof Array.isArray === "function") {
        return Array.isArray(object);
    } else {
        return !!(object instanceof Array);
    }
}

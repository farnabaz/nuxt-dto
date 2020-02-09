import get from 'lodash.get'

export interface PropMap {
    path?: string | ((arg: any) => any);
    type?: (new() => any) | [any];
    required?: boolean;
}

export interface PropsMap {
    [key: string]: PropMap;
}

export interface ModelData {
    props?: PropsMap;
    request?: ModelRequest;
}

export interface ModelRequest {
    path: string;
    method: "post" | "put" | "patch" | "delete" | "get" | "head";
}

export function Model(data: ModelData) {
    return function mapperDecorator<T extends new(...args: any[]) => {}>(constructor: T) {
        constructor.prototype.__request = data.request;
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

function set<T>(obj: T, key: string, value: any) {
    Object.assign(obj, {
        [key]: value
    });
}

export function mapArray<T>(type: (new() => T), json: any): T[] {
    if (!json || !isArray(json)) {
        return [];
    }
    const jsonArray = json as any[];
    return jsonArray.map<T>(
        (item) => mapObject<T>(type, item)
    );
}

export function mapObject<T>(clazz: new() => T, jsonObject: any): T {
    if (jsonObject === null || typeof jsonObject !== "object") {
        return new clazz();
    }
    const data: PropsMap = clazz.prototype.__map || {};
    const obj = new clazz();

    Object.keys(data).forEach((key) => {
        const map = data[key];
        const propertyKey = map.path || key;
        let value;

        if (typeof propertyKey === "function") {
            const f = propertyKey as (arg: any) => any;
            value = f(jsonObject);
        } else {
            value = get(jsonObject, propertyKey);
        }

        if (map.required && value === undefined) {
            throw new Error(`Cannot find property '${propertyKey}' from ${clazz.name}`);
        }

        let model;
        if (!map.type || isPrimitive(value)) {
            model = value;
        } else {
            model = mapModel(map.type, value);
        }

        set(obj, key, model);
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
    obj instanceof Boolean || obj === Boolean ||
    obj === undefined || obj === null);
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

export function mapModel<T>(type: [(new() => T)], jsonObject: any): T[];
export function mapModel<T>(type: (new() => T), jsonObject: any): T;
export default function mapModel<T>(type: (new() => T) | [(new() => T)], jsonObject: any): T | T[] {
    if (isArray(type)) {
        const itemClass = (type as [(new() => T)])[0];
        return mapArray<T>(itemClass, jsonObject);
    }

    const clazz = type as (new(arg?: any) => T);
    /**
     * return new instance of `clazz` if property map does not available
     */
    if (typeof clazz.prototype.__map === "undefined" && typeof clazz === "function") {
        return new clazz(jsonObject);
    }

    return mapObject(clazz, jsonObject);
}

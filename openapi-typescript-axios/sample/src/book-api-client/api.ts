// tslint:disable
/**
 * Book API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import globalAxios, { AxiosInstance, AxiosPromise } from 'axios';
import * as globalImportUrl from 'url';

// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, BaseAPI, COLLECTION_FORMATS, RequestArgs, RequiredError } from './base';
import { Configuration } from './configuration';

/**
 * 
 * @export
 * @interface Book
 */
export interface Book {
    /**
     * 
     * @type {number}
     * @memberof Book
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof Book
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof Book
     */
    published_at: string;
}
/**
 * 
 * @export
 * @interface Books
 */
export interface Books {
    /**
     * 
     * @type {Array<Book>}
     * @memberof Books
     */
    books: Array<Book>;
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Get all books
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getBooks: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/books`;
            const localVarUrlObj = globalImportUrl.parse(localVarPath, true);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarUrlObj.query = {...localVarUrlObj.query, ...localVarQueryParameter, ...options.query};
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: globalImportUrl.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Get all books
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getBooks(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Books>> {
            const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).getBooks(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Get all books
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getBooks(options?: any): AxiosPromise<Books> {
            return DefaultApiFp(configuration).getBooks(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * Get all books
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getBooks(options?: any) {
        return DefaultApiFp(this.configuration).getBooks(options).then((request) => request(this.axios, this.basePath));
    }

}


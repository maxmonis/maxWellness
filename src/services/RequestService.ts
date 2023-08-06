/**
 * Base class which exposes HTTP methods which
 * all rely on the same URL resource
 */
export default class RequestService {
  private readonly url: Url
  constructor(url: Url) {
    this.url = url
  }

  /**
   * Makes a GET request. Optionally
   * can include a route and/or params
   */
  protected get<T>(request?: Request<"GET">) {
    return this.makeRequest<T>({method: "GET", ...request})
  }

  /**
   * Makes a DELETE request. Optionally
   * can include a route and/or params
   */
  protected delete<T>(request?: Request<"DELETE">) {
    return this.makeRequest<T>({method: "DELETE", ...request})
  }

  /**
   * Makes a POST request. Must include a body
   * and optionally can include a route
   */
  protected post<T>(request: Request<"POST">) {
    return this.makeRequest<T>({method: "POST", ...request})
  }

  /**
   * Makes a PUT request. Must include a body
   * and optionally can include a route
   */
  protected put<T>(request: Request<"PUT">) {
    return this.makeRequest<T>({method: "PUT", ...request})
  }

  /**
   * Makes a PATCH request. Must include a body
   * and optionally can include a route
   */
  protected patch<T>(request: Request<"PATCH">) {
    return this.makeRequest<T>({method: "PATCH", ...request})
  }

  /**
   * Common method for making async requests using fetch
   */
  private async makeRequest<T>({
    body,
    method,
    params,
    route,
    ...request
  }: BaseRequest): Promise<T> {
    const url = this.getUrl({params, route})
    const res = await fetch(url, {
      body: JSON.stringify(body),
      method,
      ...request,
    })
    if (!res.ok) {
      throw Error("Unable to fetch")
    }
    return res.json()
  }

  /**
   * Appends route and params (if any) to base URL
   */
  private getUrl({params = {}, route}: {params?: object; route?: string}) {
    let url = this.url
    if (route) {
      url += `/${route}`
    }
    const searchParams = Object.entries(params)
    if (searchParams.length > 0) {
      url += `?${new URLSearchParams(searchParams)}`
    }
    return url
  }
}

/**
 * Either an internal route or a secure external one
 */
type Url = `${"api/" | "https://"}${string}`

/**
 * The request config we use for all methods,
 * the shape of which is determined by whether
 * the request method requires a body or not
 */
type BaseRequest = Omit<RequestInit, "body" | "method"> & {
  route?: string
} /* GET and DELETE have no body, optional params */ & (
    | {
        body?: never
        method: "GET"
        params?: object
      }
    | {
        body?: never
        method: "DELETE"
        params?: object
      }
    /* POST, PUT, and PATCH have required body, no params */
    | {
        body: object
        method: "POST"
        params?: never
      }
    | {
        body: object
        method: "PUT"
        params?: never
      }
    | {
        body: object
        method: "PATCH"
        params?: never
      }
  )

/**
 * Takes a generic HTTP method and extracts the
 * corresponding fetch request config
 */
type Request<T extends BaseRequest["method"]> = Omit<
  Extract<BaseRequest, {method: T}>,
  "method"
>

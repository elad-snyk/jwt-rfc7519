const hmac = require('./hmac');
const base64url = require('base64url');

export class JWS {
    readonly protected : string;
    protected valid : boolean;
    private mac : typeof hmac.hmacFn;
    private signature : string;
    private header : JWSRegisteredHeaderParameters;
    private payload : JWTRegisteredClaimNames;

    constructor(
        header? : JWSRegisteredHeaderParameters,
        payload? : JWTRegisteredClaimNames,
    ) {
        this.header = header || <JWSRegisteredHeaderParameters> {};
        this.payload = payload || <JWTRegisteredClaimNames> {};
        this.mac = header ? hmac[header.alg.toLowerCase()] : null;
        this.valid = !!(header && payload);
        this.protected = "";
        this.signature = "";
    }

    isValid() : boolean {
        return this.valid;
    }

    fromString(jwt : string) : JWS {
       const sections = jwt.split(".");
       if (sections.length !== 3) {
        this.valid = false;
        return <JWS> {};
       }
       const [ header, payload, signature ] = sections;
       const bHeader = btoa(base64url.toBase64(header));
       const bPayload = btoa(base64url.toBase64(payload));
       this.header = <JWSRegisteredHeaderParameters> JSON.parse(bHeader);
       this.payload = <JWTRegisteredClaimNames> JSON.parse(bPayload);
       this.signature = signature;
       this.mac = hmac[this.header.alg.toLocaleLowerCase()];
       this.valid = true;
       return this;
    }

    sign(key : string) : string {
        const { h, p, s } = sign(this.mac, this.header, this.payload, key);
        this.signature = s;
        return `${ h }.${ p }.${ s }`;
    }

    verify(key : string) : boolean {
        // signature validation
        if (!this.signature) return false;
        const { s } = sign(this.mac, this.header, this.payload, key);
        const test = btoa(base64url.toBase64(this.signature));
        const correct = btoa(base64url.toBase64(s));
        // expiration validation
        if (this.payload.exp && this.payload.exp < Date.now())
            return false;
        return  test === correct;
    }
}

function btoa(str : string) : string {
    return Buffer.from(str, 'base64').toString('utf8');
}

function sign(
    signer : typeof hmac.hmacFn,
    header : JWSRegisteredHeaderParameters,
    payload : JWTRegisteredClaimNames,
    key : string
) {
    const head = JSON.stringify(header);
    const payl = JSON.stringify(payload);
    const h = base64url.encode(head);
    const p = base64url.encode(payl);
    const s = base64url.fromBase64(signer(`${ h }.${ p }`, key));
    return { h, p, s };
}

/**
 * StandardClaims : the standard JWT claims defined in the RFC 7519 spec.
 * https://tools.ietf.org/html/rfc7519#section-1
 */
export interface JWTRegisteredClaimNames {
    /**
     * ISS : issuer : identifies the principal that issued the JWT.
     * StringOrURI. Case-sensitive. Optional.
     */
    iss? : string,

    /**
     * SUB : subject : identifies the principal that is the subject of the JWT.
     * StringOrURI. Case-sensitive. Optional.
     */
    sub? : string,

    /**
     * AUD : audience : identifies the recipients that the JWT is intended for.
     * StringOrURI. Case-sensitive. Optional.
     */
    aud? : string | Array<string>,

    /**
     * EXP : expiration : identifies the expiration time on or after which the
     * JWT MUST NOT be accepted for processing.
     * NumericDate. Optional.
     */
    exp? : number,

    /**
     * NBF : not before : identifies the time before which the JWT MUST NOT be
     * accepted for processing.
     * NumericDate. Optional.
     */
    nbf? : number,

    /**
     * IAT : issued at : identifies the time at which the JWT was issued.
     * NumericDate. Optional.
     */
    iat? : number,

    /**
     * JTI : jwt id : provides a unique identifier for the JWT.
     * Optional.
     */
    jti? : string
}

/**
 * IANAMediaType : two-part identifier for file formats and format contents
 * https://www.iana.org/assignments/media-types/media-types.xhtml
 */
type IANAMediaType = string;

/**
 * StandardHeaders : the standard JWT headers defined in the RFC 7519 spec.
 * https://tools.ietf.org/html/rfc7519#section-1
 */
interface JOSEHeaders {
    /**
     * TYP : type : is used by JWT applications to declare the media type
     * of this complete JWT. Optional.
     */
    typ? : "JWT" | string,

    /**
     * CTY : content type : is defined by the specification as a way to convey
     * structural information about the JWT. Optional. NOT RECOMMENDED.
     */
    cty? : string,
}

interface JWSRegisteredHeaderParameters extends JOSEHeaders {
    /**
     * ALG : algorithm : identifies the cryptographic algorithm
     * used to secure the JWS.
     * Optional. Case-sensitive.
     */
    alg : "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" |
                "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" |
                "none",

    /**
     * JKU : jwk set url :  is a URI that refers to a resource for a
     * set of JSON-encoded public keys, one of which corresponds to the
     * key used to digitally sign the JWS.
     * Optional.
     */
    jku? : string,

    /**
     * JWK : json web key : is the public key that corresponds to the key
     * used to digitally sign the JWS. Optional.
     *
     */
    jwk? : string,

    /**
     * KID : key id : is used to match a specific key.
     * Optional.
     */
    kid? : string,

    /**
     * X5U : X.509 URL : is a URI [RFC3986] that refers to a resource for
     * the X.509 public key certificate or certificate chain [RFC5280]
     * corresponding to the key used to digitally sign the JWS.
     * Optional.
     */
    x5u? : string,

    /**
     * X5C : X.509 Certificate Chain : contains the X.509 public key
     * certificate or certificate chain [RFC5280] corresponding to the
     * key used to digitally sign the JWS.
     * Optional.
     */
    x5c? : string,

    /**
     * X5T : X.509 Certificate SHA-1 Thumbprint : is a base64url-encoded
     * SHA-1 thumbprint (a.k.a. digest) of the DER encoding of the X.509
     * certificate [RFC5280] corresponding to the key used to digitally
     * sign the JWS.
     * Optional.
     */
    x5t? : string,

    /**
     * X5T#S256 : X.509 Certificate SHA-256 Thumbprint : is a base64url-encoded
     * SHA-256 thumbprint (a.k.a. digest) of the DER encoding of the X.509
     * certificate [RFC5280] corresponding to the key used to digitally
     * sign the JWS.
     * Optional.
     */
    "x5t#S256"? : string,

    /**
     * CRIT : critical : indicates that extensions to this specification and/or
     * [JWA] are being used that MUST be understood and processed.
     * Optional.
     */
    crit? : Array<string>,
}
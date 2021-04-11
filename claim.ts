interface claim {
    name : string,
    shortname : string,
    optional : boolean,
}

export class Claim {
    readonly name : string;
    readonly shortname : string;
    readonly optional : boolean;
    readonly set : ClaimSetter;

    constructor (
        name : string,
        shortname : string,
        optional : boolean,
        setter : ClaimSetter,
    ) {
        this.name = name;
        this.shortname = shortname;
        this.optional = optional;
        this.set = setter.bind(this);
    }
}

export function NewClaim (
    claim : claim,
    setter : ClaimSetter,
) {
    return new Claim(
        claim.name,
        claim.shortname,
        claim.optional,
        setter,
    );
}

interface ClaimSetter {
    (value : any) : void
}
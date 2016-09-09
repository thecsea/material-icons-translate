/**
 * Created by claudio on 09/09/16.
 */
Array.prototype.list = function()
{
    var
        limit = this.length,
        orphans = arguments.length - limit,
        scope = {};

    while(limit--) scope[arguments[limit]] = this[limit];

    if(orphans > 0)
    {
        orphans += this.length;
        while(orphans-- > this.length) scope[arguments[orphans]] = null;
    }

    return scope;
};
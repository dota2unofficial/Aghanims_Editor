export const indent = (str, numOfIndents, opt_spacesPerIndent) => {
    str = str.replace(/^(?=.)/gm, new Array(numOfIndents + 1).join('\t'));
    numOfIndents = new Array(opt_spacesPerIndent + 1 || 0).join(' '); // re-use
    return opt_spacesPerIndent ? str.replace(/^\t+/g, tabs => {
        return tabs.replace(/./g, numOfIndents);
    }) : str;
}
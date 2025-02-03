function format(str, ...rest) {
    let result = `${str}`; // Copy the original to avoid overwrite errors

    (rest ?? []).forEach((value, index) => {
        result = result.replace(new RegExp('\\{' + index + '\\}', 'g'), value);
    });

    return result;
}

function replaceAll(str, subStr, newSubStr) {
    return str.replace(new RegExp(subStr, 'g'), newSubStr);
}

function insert(str, index, value) {
    return str.substr(0, index) + ' ' + value + str.substr(index);
}

module.exports = { format, replaceAll, insert };

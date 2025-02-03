const afterAllFunction = function () {
    setTimeout(() => {
        process.exit(0);
    }, 10000);
};

export { afterAllFunction as afterAllHook };

var fs = require('fs'),
    outputDir = process.env.OUTPUT_DIR || './__',
    env,
    envStr,
    fn;

try {
    env = JSON.parse(process.env.ENV_JSON);
} catch (e) {
    env = {};
    console.log('Failed to parse process env variable.')
}

envStr = JSON.stringify(env);

fn = "(function (root, factory) {\n\
    if (typeof define === 'function' && define.amd) {\n\
        // AMD. Register as an anonymous module.\n\
        define([''], function () {\n\
            return (root.__env = factory());\n\
        });\n\
    } else if (typeof exports === 'object') {\n\
        // Node. Does not work with strict CommonJS, but\n\
        // only CommonJS-like enviroments that support module.exports,\n\
        // like Node.\n\
        module.exports = factory();\n\
    } else {\n\
        // Browser globals\n\
        root.__env = factory();\n\
    }\n\
}(this, function () {\n\
    return ENV;\n\
}));"

// Create the dir if it doesn't exist.
fs.stat(outputDir, function(err, stat) {
    if (err || stat == null) {
        fs.mkdir(outputDir, createFiles)
    } else {
        createFiles()
    }
})

function createFiles(err) {
    if (err) throw err;

    // Create json file.
    fs.writeFileSync(outputDir + '/env.json', envStr);

    // Create js file.
    fs.writeFileSync(outputDir + '/env.js', fn.replace(/ENV/, envStr));

    // Exit.
    process.exit()
}

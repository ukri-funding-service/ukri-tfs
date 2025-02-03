import { expect } from 'chai';
import fs from 'fs';
import path from 'path';

describe('React dependencies', () => {
    const packagejson = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), { encoding: 'utf-8' }),
    );

    it('should not contain React in runtime dependencies', () => {
        // The consequences of adding this are not immediately obvious, whereas hopefully this test failure is!
        // Two copies of React finish up in the front-end, one from ui-components one from the front end itself,
        // but you don't actually get an error until you attempt to load a page containing a React hook.
        // In particular the "Mark as complete" checkbox comes from gov-react-jsx and contains the obvious
        // piece of boolean state inside a hook.
        expect(packagejson.dependencies.react).to.be.undefined;
        expect(packagejson.dependencies['react-dom']).to.be.undefined;
    });

    it('should have React in devDependencies', () => {
        // The consequences of adding this are not immediately obvious, whereas hopefully this test failure is!
        // Two copies of React finish up in the front-end, one from ui-components one from the front end itself,
        // but you don't actually get an error until you attempt to load a page containing a React hook.
        // In particular the "Mark as complete" checkbox comes from gov-react-jsx and contains the obvious
        // piece of boolean state inside a hook.
        expect(packagejson.devDependencies.react).to.exist;
        expect(packagejson.devDependencies['react-dom']).to.exist;
    });

    it('should have React in peerDependencies', () => {
        // It's just good manners to let whoever is installing ui-components that they also need to install React
        expect(packagejson.peerDependencies.react).to.not.be.undefined;
        expect(packagejson.peerDependencies['react-dom']).to.not.be.undefined;
    });
});

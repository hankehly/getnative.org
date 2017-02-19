/**
 * lang.service.spec
 * get-native.com
 *
 * Created by henryehly on 2016/12/29.
 */

import { LangService } from './lang.service';
import { Languages } from './languages';

export function main() {
    let service: LangService;

    describe('LangService', () => {
        beforeAll(() => {
            service = new LangService();
        });

        it('should convert \'en\' to \'English\'', () => {
            let expected = 'English';
            let actual = service.codeToName('en');
            expect(actual).toEqual(expected);
        });

        it('should convert \'ja\' to \'日本語\'', () => {
            let expected = '日本語';
            let actual = service.codeToName('ja');
            expect(actual).toEqual(expected);
        });

        it('should return the appropriate Language given a language code', () => {
            let expected = Languages[0];

            let langCode = Languages[0].code;
            let actual = service.languageForCode(langCode);

            expect(actual).toEqual(expected);
        });
    });
}

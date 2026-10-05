// The site's icons: Phosphor (regular), the family the theme toggle already uses. Read at build time,
// so only the SVGs that are used end up in the pages, and sized in em so they follow the text.
import article from '@phosphor-icons/core/assets/regular/article.svg?raw';
import bookOpenText from '@phosphor-icons/core/assets/regular/book-open-text.svg?raw';
import briefcase from '@phosphor-icons/core/assets/regular/briefcase.svg?raw';
import code from '@phosphor-icons/core/assets/regular/code.svg?raw';
import copy from '@phosphor-icons/core/assets/regular/copy.svg?raw';
import envelope from '@phosphor-icons/core/assets/regular/envelope-simple.svg?raw';
import flag from '@phosphor-icons/core/assets/regular/flag-checkered.svg?raw';
import github from '@phosphor-icons/core/assets/regular/github-logo.svg?raw';
import globe from '@phosphor-icons/core/assets/regular/globe-simple.svg?raw';
import image from '@phosphor-icons/core/assets/regular/image.svg?raw';
import linkedin from '@phosphor-icons/core/assets/regular/linkedin-logo.svg?raw';
import play from '@phosphor-icons/core/assets/regular/play.svg?raw';
import repeat from '@phosphor-icons/core/assets/regular/arrow-clockwise.svg?raw';
import user from '@phosphor-icons/core/assets/regular/user.svg?raw';

const raw = { article, bookOpenText, briefcase, code, copy, envelope, flag, github, globe, image, linkedin, play, repeat, user };

export type IconName = keyof typeof raw;

/** The SVG markup for an icon: decorative, sized to the text, coloured by currentColor. */
export function iconSvg(name: IconName) {
	return raw[name].replace('<svg ', '<svg class="ico" aria-hidden="true" focusable="false" width="1em" height="1em" ');
}

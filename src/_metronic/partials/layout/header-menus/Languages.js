/* eslint-disable jsx-a11y/anchor-is-valid */
import {toAbsoluteUrl} from '../../../helpers'

const languages = [
    {
        lang: 'en',
        name: 'English',
        flag: toAbsoluteUrl('/media/flags/united-states.svg'),
    }
]

const Languages = () => {
    const lang = 'en'
    const currentLanguage = languages.find((x) => x.lang === lang)
    return (
        <div
            className='menu-item px-5'
            data-kt-menu-trigger='hover'
            data-kt-menu-placement='left-start'
            data-kt-menu-flip='bottom'
        >
            <a href='#' className='menu-link px-5'>
        <span className='menu-title position-relative'>
          Language
          <span className='fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0'>
            {currentLanguage?.name}{' '}
          </span>
        </span>
            </a>
        </div>
    )
}

export {Languages}

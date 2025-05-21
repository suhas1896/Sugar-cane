// filepath: c:\Users\PSUHAS1\translate-test\src\main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateService, TranslateStore, TranslateCompiler, TranslateFakeCompiler, TranslateParser, TranslateDefaultParser, MissingTranslationHandler, FakeMissingTranslationHandler, USE_DEFAULT_LANG, ISOLATE_TRANSLATE_SERVICE, USE_EXTEND, DEFAULT_LANGUAGE } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
// Removed provideTranslate as it is not exported by @ngx-translate/core


// Factory function for the TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    // Removed provideTranslate() as it is not a valid provider

    provideHttpClient(),
    {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },
    {
      provide: TranslateCompiler,
      useClass: TranslateFakeCompiler // Use a fake compiler for basic translations
    },
    {
      provide: TranslateParser,
      useClass: TranslateDefaultParser // Provide the default parser for translations
    },
    {
      provide: MissingTranslationHandler,
      useClass: FakeMissingTranslationHandler // Provide a fake handler for missing translations
    },
    {
      provide: USE_DEFAULT_LANG,
      useValue: true // Enable the use of the default language
    },
    {
      provide: ISOLATE_TRANSLATE_SERVICE,
      useValue: false // Ensure the TranslateService is shared globally
    },
    {
      provide: USE_EXTEND,
      useValue: false // Disable extending translations by default
    },
    {
      provide: DEFAULT_LANGUAGE,
      useValue: 'en' // Set the default language to English
    },
    TranslateService,
    TranslateStore
  ]
}).catch(err => console.error(err));
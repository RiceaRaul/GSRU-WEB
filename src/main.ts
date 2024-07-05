import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'app/app.module';
import "app/_core/prototypes/formdata.proto"

platformBrowserDynamic().bootstrapModule(AppModule)
.catch(err => console.error(err));

import { Routes } from '@angular/router';
import { HomeComponent } from './core/features/luxor-national-university/Pages/Home/Home.component';
import { AboutUniversityComponent } from './core/features/luxor-national-university/Pages/about-university/about-university.component';
import { NewsComponent } from './core/features/luxor-national-university/Pages/news/news.component';
import { NewsDetailsComponent } from './core/features/luxor-national-university/Pages/news/news-details/news-details.component';
import { FacultiesComponent } from './core/features/luxor-national-university/Pages/faculties/faculties.component';
import { FacultyDetailsComponent } from './core/features/luxor-national-university/Pages/faculties/faculty-details/faculty-details.component';
import { LuxorNationalUniversityComponent } from './core/features/luxor-national-university/luxor-national-university.component';
import { ServicesComponent } from './core/features/luxor-national-university/Pages/services/services.component';
import { ContactUsComponent } from './core/features/luxor-national-university/Pages/contact-us/contact-us.component';
import { CustomPageComponent } from './core/features/luxor-national-university/Pages/shared/custom-page/custom-page.component';

export const routes: Routes = [

   {
     path: '',
     component: LuxorNationalUniversityComponent,
     children: [
       { path: '', redirectTo: 'home', pathMatch: 'full' },
       { path: 'home', component: HomeComponent },
       { path: 'about', component: AboutUniversityComponent},
       { path: 'about/overview', component: AboutUniversityComponent},
       { path: 'about/vision', component: AboutUniversityComponent},
       { path: 'about/mission', component: AboutUniversityComponent},
       { path: 'about/goals', component: AboutUniversityComponent},
       { path: 'about/history', component: AboutUniversityComponent},

       {path: 'news', component: NewsComponent},
       {path: 'news/:slug', component: NewsDetailsComponent},
       {path: 'faculties', component: FacultiesComponent},
       {path: 'faculties/:slug', component: FacultyDetailsComponent},
       {path: 'services', component: ServicesComponent},
       {path: 'services/:id', component: ServicesComponent},
       {path: 'contactInfo', component: ContactUsComponent},
       { path: 'custom', component: CustomPageComponent },
       { path: 'custom/:slug', component: CustomPageComponent },
       {path: '**', redirectTo: 'home' },
   ]}
];

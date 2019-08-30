import {MatProgressBarModule} from '@angular/material/progress-bar';
import { StudyInquiryComponent } from './study-inquiry/study-inquiry.component';

@Injectable()
export class FormlyConfig {
  public static config = {
    types: [
      {name: 'repeat', component: RepeatSectionComponent},
      {
        name: 'autocomplete',
        component: AutocompleteSectionComponent,
        wrappers: ['form-field'],
      }
    ],
    validators: [
      {name: 'phone', validation: PhoneValidator},
      {name: 'email', validation: EmailValidator},
      {name: 'url', validation: UrlValidator},
    ],
    validationMessages: [
      {name: 'phone', message: PhoneValidatorMessage},
      {name: 'email', message: EmailValidatorMessage},
      {name: 'url', message: UrlValidatorMessage},
      {name: 'required', message: 'This field is required.'},
    ],
    wrappers: [
      {name: 'help', component: HelpWrapperComponent},
      {name: 'card', component: CardWrapperComponent},
    ],
  };
}

@NgModule({
  declarations: [
    AccordionComponent,
    AdminHomeComponent,
    AppComponent,
    AutocompleteSectionComponent,
    AvatarDialogComponent,
    AvatarDialogComponent,
    CardWrapperComponent,
    CategoryChipsComponent,
    AboutComponent,
    FiltersComponent,
    FiltersComponent,
    FlowCompleteComponent,
    FlowCompleteComponent,
    FlowComponent,
    FlowIntroComponent,
    FlowIntroComponent,
    ForgotPasswordComponent,
    HeaderComponent,
    HelpWrapperComponent,
    HeroSlidesComponent,
    HomeComponent,
    LoadingComponent,
    LoginComponent,
    LogoComponent,
    LogoutComponent,
    LogoutComponent,
    NewsItemComponent,
    ParticipantDetailComponent,
    ParticipantProfileComponent,
    PasswordResetComponent,
    ProfileComponent,
    QuestionnaireDataTableComponent,
    QuestionnaireDataViewComponent,
    QuestionnaireStepComponent,
    QuestionnaireStepsListComponent,
    RegisterComponent,
    RepeatSectionComponent,
    ResourceAddButtonComponent,
    ResourceDetailComponent,
    ResourceEditButtonComponent,
    ResourceFormComponent,
    ResourcesComponent,
    SearchBoxComponent,
    SearchComponent,
    SearchResultComponent,
    SearchResultComponent,
    StudiesComponent,
    StudyDetailComponent,
    TermsComponent,
    TimedoutComponent,
    TypeIconComponent,
    UserAdminComponent,
    UserAdminDetailsComponent,
    FooterComponent,
    MirrorComponent,
    AdminExportComponent,
    AdminExportDetailsComponent,
    DetailsLinkComponent,
    BorderBoxTileComponent,
    StudyInquiryComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({apiKey: environment.gc_api_key}),
    AgmJsMarkerClustererModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    FormlyMatDatepickerModule,
    FormlyMaterialModule,
    FormlyModule.forRoot(FormlyConfig.config),
    FormsModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    NgProgressModule,
    PdfJsViewerModule,
    ReactiveFormsModule,
    RoutingModule,
    MatRadioModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    ApiService,
    IntervalService,
    SearchService,

  ],
  bootstrap: [AppComponent],
  entryComponents: [AvatarDialogComponent, AdminExportDetailsComponent]
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('stardrive-theme');
  }
}

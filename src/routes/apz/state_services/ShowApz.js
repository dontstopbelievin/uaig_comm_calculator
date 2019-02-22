import React from 'react';
import $ from 'jquery';
import Loader from 'react-loader-spinner';
import ReactQuill from 'react-quill';
import CommissionAnswersList from '../../../components/CommissionAnswersList';
import ShowMap from "./ShowMap";

export default class ShowApz extends React.Component {
    constructor(props) {
      super(props);

      this.webSocket = new WebSocket('wss://127.0.0.1:13579/');
      this.heartbeat_msg = '--heartbeat--';
      this.heartbeat_interval = null;
      this.missed_heartbeats = 0;
      this.missed_heartbeats_limit_min = 3;
      this.missed_heartbeats_limit_max = 50;
      this.missed_heartbeats_limit = this.missed_heartbeats_limit_min;
      this.callback = null;

      this.state = {
        apz: [],
        templates: [],
        showMap: false,
        showButtons: false,
        showSendButton: false,
        showSignButtons: false,
        file: null,
        description: "",
        docNumber: "",
        response: false,
        personalIdFile: false,
        confirmedTaskFile: false,
        titleDocumentFile: false,
        additionalFile: false,
        showMapText: 'Показать карту',
        accept: true,
        storageAlias: "PKCS12",
        templateType: '',
        backFromHead: false,
        backFromGP: false,
        backFromEngineer: false,

        basisForDevelopmentApz: 'Постановление акимата города (района) №_____ от __________ (число, месяц, год)',
        buildingPresence: 'Строений нет',
        address: 'Город, район, микрорайон, аул, квартал',
        geodeticStudy: 'Предусмотреть в проекте',
        engineeringGeologicalStudy: 'По фондовым материалам (топографическая съемка, масштаб, наличие корректировок)',
        planningSystem: 'По проекту с учетом функционального назначения объекта',
        functionalValueOfObject: 'Спортивно-развлекательный оздоровительный центр',
        floorSum: 'По градостроительному регламенту',
        structuralScheme: 'По проекту',
        engineeringSupport: 'Централизованное. Предусмотреть коридоры инженерных и внутриплощадочных сетей в пределах отводимого участка',
        energyEfficiencyClass: 'Указать в проекте',
        spatialSolution: 'Увязать со смежными по участку объектами',
        draftMasterPlan: 'Учесть ограниченные территориальные параметры участка и перспективу развития транспортно-пешеходных коммуникаций. Следует располагать с отступом от красной линии согласно СН РК 3.01-01-2013.',
        verticalLayout: 'Увязать с высотными отметками ПДП прилегающей территории',
        landscapingAndGardening: 'В генплане указать нормативное описание',
        parking: 'На своем земельном участке',
        useOfFertileSoilLayer: 'На усмотрение собственника',
        smallArchitecturalForms: 'Указать в проекте',
        lighting: 'Указать в проекте',
        stylisticsOfArchitecture: 'Сформировать архитектурный образ в соответствии с функциональными особенностями объекта',
        natureCombination: 'С целью улучшения архитектурного облика города сформировать архитектурный образ в соответствии с фасадами существующих объектов.',
        colorSolution: 'Согласно эскизному проекту',
        advertisingAndInformationSolution: 'Предусмотреть рекламно-информационные установки согласно статьи 21 Закона Республики Казахстан «О языках Республики Казахстан»',
        nightLighting: 'Указать в проекте',
        inputNodes: 'Предложить акцентирование входных узлов. Предусматривать систему охраны входов (аудио-, видеодомофон, и т.д.) Оборудовать современными средствами дистанционного электронного контроля',
        conditionsForLowMobileGroups: 'Предусмотреть мероприятия в соответствии с указаниями и требованиями строительных нормативных документов РК; предусмотреть доступ инвалидов к зданию, предусмотреть пандусы, специальные подъездные пути и устройства для проезда инвалидных колясок',
        complianceNoiseConditions: 'Согласно СНиП РК',
        plinth: 'Указать в проекте',
        facade: 'Указать в проекте',
        heatSupply: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
        waterSupply: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
        sewerage: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
        powerSupply: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
        gasSupply: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
        phoneSupply: 'Технические условия не предусмотрены',
        drainage: 'Технические условия не предусмотрены',
        irrigationSystems: 'Технические условия не предусмотрены',
        engineeringSurveysObligation: 'Приступать к освоению земельного участка разрешается после геодезического выноса и закрепления его границ в натуре (на местности) и ордера на производство земляных работ',
        demolitionObligation: 'В случае необходимости краткое описание',
        transferCommunicationsObligation: 'Согласно техническим условиям на перенос (вынос) либо на проведения мероприятия по защите сетей и сооружений',
        conservationPlantObligation: 'Указать в проекте',
        temporaryFencingConstructionObligation: 'Указать в проекте',
        additionalRequirements: '1. При проектировании системы кондиционирования в здании (в том случае, когда проектом не предусмотрено централизованное холодоснабжение и кондиционирование) необходимо предусмотреть размещение наружных элементов локальных систем в соответствии с архитектурным решением фасадов здания. На фасадах проектируемого здания предусмотреть места (ниши, выступы, балконы и т.д.) для размещения наружных элементов локальных систем кондиционирования.<br />2. Приненить материалы по ресурсосбережению и современных энергосберегающих технологий.',
        generalRequirements: '1. При разработке проекта (рабочего проекта) необходимо руководствоваться нормами действующего законодательства Республики Казахстан в сфере архитектурной, градостроительной и строительной деятельности.<br />2. Согласовать с главным архитектором города (района):<br />- Эскизный проект',
        notes: '1. АПЗ и ТУ действуют в течение всего срока нормативной продолжительности строительства, утвержденного в составе проектной (проектно-сметной) документации.<br />2. В случае возникновения обстоятельств, требующих пересмотра условий АПЗ, изменения в него могут быть внесены по согласованию с заказчиком.<br />3. Требования и условия, изложенные в АПЗ, обязательны для всех участников инвестиционного процесса независимо от форм собственности и источников финансирования. АПЗ по просьбе заказчика или местного органа архитектуры и градостроительства может быть предметом обсуждения градостроительного совета, архитектурной общественности, рассмотрено в независимой экспертизе.<br />4. Несогласие заказчика с требованиями, содержащимися в АПЗ, может быть обжаловано в судебном порядке.',
        loaderHidden:true
      };

      this.onFileChange = this.onFileChange.bind(this);
      this.onDescriptionChange = this.onDescriptionChange.bind(this);
      this.sendForm = this.sendForm.bind(this);
      this.onInputChange = this.onInputChange.bind(this);
    }
    componentDidMount() {
      this.props.breadCrumbs();
    }

    onTypeChange(type) {
      if (!window.confirm('При смене шаблона, вся информация, находящаяся в обновляемых разделах перезапишется. Продолжить?')) {
        return false;
      }

      switch (type) {
        case 'big_object':
          this.setState({
            templateType: 'big_object',
            basisForDevelopmentApz: '1. Письмо застройщика<br />2. Акт на земельный участок.<br />3. Задание на проектирование утвержденное застройщиком (заказчиком)',
            buildingPresence: 'Строений нет',
            address: 'Город, район, микрорайон, аул, квартал',
            geodeticStudy: 'Предусмотреть в проекте',
            engineeringGeologicalStudy: 'По фондовым материалам (топографическая съемка, масштаб, наличие корректировок)',
            planningSystem: 'По проекту с учетом функционального назначения объекта',
            functionalValueOfObject: 'Строительство многофункционального жилого комплекса',
            floorSum: '9 этажей',
            structuralScheme: 'По проекту',
            engineeringSupport: 'Централизованное. Предусмотреть коридоры инженерных и внутриплощадочных сетей в пределах отводимого участка',
            energyEfficiencyClass: 'Указать в проекте',
            spatialSolution: 'Увязать со смежными по участку объектами',
            draftMasterPlan: 'Учесть ограниченные территориальные параметры участка и перспективу развития транспортно-пешеходных коммуникаций. Следует располагать с отступом от красной линии согласно СН РК 3.01-01-2013.',
            verticalLayout: 'Увязать с высотными отметками ПДП прилегающей территории',
            landscapingAndGardening: 'В генплане указать нормативное описание',
            parking: 'На своем земельном участке',
            useOfFertileSoilLayer: 'На усмотрение собственника',
            smallArchitecturalForms: 'Указать в проекте',
            lighting: 'Указать в проекте',
            stylisticsOfArchitecture: 'Сформировать архитектурный образ в соответствии с функциональными особенностями объекта',
            natureCombination: 'С целью улучшения архитектурного облика города сформировать архитектурный образ в соответствии с фасадами существующих объектов.',
            colorSolution: 'Согласно эскизному проекту',
            advertisingAndInformationSolution: 'Предусмотреть рекламно-информационные установки согласно статьи 21 Закона Республики Казахстан «О языках Республики Казахстан»',
            nightLighting: 'Указать в проекте',
            inputNodes: 'Предложить акцентирование входных узлов. Предусматривать систему охраны входов (аудио-, видеодомофон, и т.д.) Оборудовать современными средствами дистанционного электронного контроля',
            conditionsForLowMobileGroups: 'Предусмотреть мероприятия в соответствии с указаниями и требованиями строительных нормативных документов РК; предусмотреть доступ инвалидов к зданию, предусмотреть пандусы, специальные подъездные пути и устройства для проезда инвалидных колясок',
            complianceNoiseConditions: 'Согласно СНиП РК',
            plinth: 'Указать в проекте',
            facade: 'Указать в проекте',
            heatSupply: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
            waterSupply: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
            sewerage: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
            powerSupply: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
            gasSupply: 'Технические условия не предусмотрены',
            phoneSupply: 'Технические условия не предусмотрены',
            drainage: 'Технические условия не предусмотрены',
            irrigationSystems: 'Технические условия не предусмотрены',
            engineeringSurveysObligation: 'Приступать к освоению земельного участка разрешается после геодезического выноса и закрепления его границ в натуре (на местности) и ордера на производство земляных работ',
            demolitionObligation: 'В случае необходимости краткое описание',
            transferCommunicationsObligation: 'Согласно техническим условиям на перенос (вынос) либо на проведения мероприятия по защите сетей и сооружений',
            conservationPlantObligation: 'Указать в проекте',
            temporaryFencingConstructionObligation: 'Указать в проекте',
            additionalRequirements: '1. При проектировании системы кондиционирования в здании (в том случае, когда проектом не предусмотрено централизованное холодоснабжение и кондиционирование) необходимо предусмотреть размещение наружных элементов локальных систем в соответствии с архитектурным решением фасадов здания. На фасадах проектируемого здания предусмотреть места (ниши, выступы, балконы и т.д.) для размещения наружных элементов локальных систем кондиционирования.<br />2. Приненить материалы по ресурсосбережению и современных энергосберегающих технологий.',
            generalRequirements: '1. При разработке проекта (рабочего проекта) необходимо руководствоваться нормами действующего законодательства Республики Казахстан в сфере архитектурной, градостроительной и строительной деятельности.<br />2. Согласовать с главным архитектором города (района):<br />- Эскизный проект<br />Эскизный проект в полном объеме, в том числе:<br />- краткая пояснительная записка с обоснованием принятых решений;<br />- технико-экономические показатели в соответствии с требованиями строительных нормативных документов РК;<br />- ситуационная схема в М 1:2000;<br />- генплан в М 1:500 на топографической основе (проект благоустройства и озеленения);<br />- малые архитектурные формы;<br />- фасады (в цвете) с таблицей по наружной отделке согласованной с заказчиком, фрагменты фасадов (декоративные элементы и т.д.);<br />- планы этажей и план кровли, разрезы;<br />- планы инженерных сетей;',
            notes: '1. АПЗ и ТУ действуют в течение всего срока нормативной продолжительности строительства, утвержденного в составе проектной (проектно-сметной) документации.<br />2. В случае возникновения обстоятельств, требующих пересмотра условий АПЗ, изменения в него могут быть внесены по согласованию с заказчиком.<br />3. Требования и условия, изложенные в АПЗ, обязательны для всех участников инвестиционного процесса независимо от форм собственности и источников финансирования. АПЗ по просьбе заказчика или местного органа архитектуры и градостроительства может быть предметом обсуждения градостроительного совета, архитектурной общественности, рассмотрено в независимой экспертизе.<br />4. Несогласие заказчика с требованиями, содержащимися в АПЗ, может быть обжаловано в судебном порядке.'
          });
          break;

        case 'small_object':
          this.setState({
            templateType: 'small_object',
            basisForDevelopmentApz: '1. Заявление застройщика<br />2. Акт на земельный участок.<br />3. Задание на проектирование утвержденное застройщиком (заказчиком)',
            buildingPresence: 'Строений нет',
            address: 'Город, район, микрорайон, аул, квартал',
            geodeticStudy: 'Предусмотреть в проекте',
            engineeringGeologicalStudy: 'По фондовым материалам (топографическая съемка, масштаб, наличие корректировок)',
            planningSystem: 'По проекту с учетом функционального назначения объекта',
            functionalValueOfObject: 'Строительство индивидуального жилого дом',
            floorSum: 'Двухэтажный',
            structuralScheme: 'По проекту',
            engineeringSupport: 'Централизованное. Предусмотреть коридоры инженерных и внутриплощадочных сетей в пределах отводимого участка',
            energyEfficiencyClass: 'Указать в проекте',
            spatialSolution: 'Увязать со смежными по участку объектами',
            draftMasterPlan: 'Учесть ограниченные территориальные параметры участка и перспективу развития транспортно-пешеходных коммуникаций. Следует располагать с отступом от красной линии согласно СН РК 3.01-01-2013.',
            verticalLayout: 'Увязать с высотными отметками ПДП прилегающей территории',
            landscapingAndGardening: 'В генплане указать нормативное описание',
            parking: 'На своем земельном участке',
            useOfFertileSoilLayer: 'На усмотрение собственника',
            smallArchitecturalForms: '@hide',
            lighting: 'Указать в проекте',
            stylisticsOfArchitecture: 'Сформировать архитектурный образ в соответствии с функциональными особенностями объекта',
            natureCombination: 'С целью улучшения архитектурного облика города сформировать архитектурный образ в соответствии с фасадами существующих объектов.',
            colorSolution: 'Согласно эскизному проекту',
            advertisingAndInformationSolution: '@hide',
            nightLighting: 'Указать в проекте',
            inputNodes: '@hide',
            conditionsForLowMobileGroups: '@hide',
            complianceNoiseConditions: 'Согласно СНиП РК',
            plinth: 'Указать в проекте',
            facade: 'Указать в проекте',
            heatSupply: 'Технические условия не предусмотрены',
            waterSupply: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
            sewerage: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
            powerSupply: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
            gasSupply: 'Технические условия не предусмотрены',
            phoneSupply: 'Технические условия не предусмотрены',
            drainage: 'Технические условия не предусмотрены',
            irrigationSystems: 'Технические условия не предусмотрены',
            engineeringSurveysObligation: 'Приступать к освоению земельного участка разрешается после геодезического выноса и закрепления его границ в натуре (на местности) и ордера на производство земляных работ',
            demolitionObligation: 'В случае необходимости краткое описание',
            transferCommunicationsObligation: 'Согласно техническим условиям на перенос (вынос) либо на проведения мероприятия по защите сетей и сооружений',
            conservationPlantObligation: 'Указать в проекте',
            temporaryFencingConstructionObligation: 'Указать в проекте',
            additionalRequirements: '1. При проектировании системы кондиционирования в здании (в том случае, когда проектом не предусмотрено централизованное холодоснабжение и кондиционирование) необходимо предусмотреть размещение наружных элементов локальных систем в соответствии с архитектурным решением фасадов здания. На фасадах проектируемого здания предусмотреть места (ниши, выступы, балконы и т.д.) для размещения наружных элементов локальных систем кондиционирования.<br />2. Приненить материалы по ресурсосбережению и современных энергосберегающих технологий.',
            generalRequirements: '1. При разработке проекта (рабочего проекта) необходимо руководствоваться нормами действующего законодательства Республики Казахстан в сфере архитектурной, градостроительной и строительной деятельности.<br />2. Согласовать с главным архитектором города (района):<br />- Эскизный проект<br />Эскизный проект в полном объеме, в том числе:<br />- краткая пояснительная записка с обоснованием принятых решений;<br />- технико-экономические показатели в соответствии с требованиями строительных нормативных документов РК;<br />- ситуационная схема в М 1:2000;<br />- генплан в М 1:500 на топографической основе (проект благоустройства и озеленения);<br />- малые архитектурные формы;<br />- фасады (в цвете) с таблицей по наружной отделке согласованной с заказчиком, фрагменты фасадов (декоративные элементы и т.д.);<br />- планы этажей и план кровли, разрезы;<br />- планы инженерных сетей;',
            notes: '1. АПЗ и ТУ действуют в течение всего срока нормативной продолжительности строительства, утвержденного в составе проектной (проектно-сметной) документации.<br />2. В случае возникновения обстоятельств, требующих пересмотра условий АПЗ, изменения в него могут быть внесены по согласованию с заказчиком.<br />3. Требования и условия, изложенные в АПЗ, обязательны для всех участников инвестиционного процесса независимо от форм собственности и источников финансирования. АПЗ по просьбе заказчика или местного органа архитектуры и градостроительства может быть предметом обсуждения градостроительного совета, архитектурной общественности, рассмотрено в независимой экспертизе.<br />4. Несогласие заказчика с требованиями, содержащимися в АПЗ, может быть обжаловано в судебном порядке.'
          });
          break;

        case 'network_engineering':
          this.setState({
            templateType: 'network_engineering',
            basisForDevelopmentApz: '1. Письмо застройщика<br />2. Приказ.<br />3. Задание на проектирование утвержденное застройщиком (заказчиком)',
            buildingPresence: 'Строение есть',
            address: 'Город, район, микрорайон, аул, квартал',
            geodeticStudy: 'Предусмотреть в проекте',
            engineeringGeologicalStudy: 'По фондовым материалам (топографическая съемка, масштаб, наличие корректировок)',
            planningSystem: 'По проекту с учетом функционального назначения объекта',
            functionalValueOfObject: 'Реконструкция канализационных сетей',
            floorSum: '@hide',
            structuralScheme: '@hide',
            engineeringSupport: 'Централизованное. Предусмотреть коридоры инженерных и внутриплощадочных сетей в пределах отводимого участка',
            energyEfficiencyClass: 'Указать в проекте',
            spatialSolution: 'Увязать со смежными по участку объектами',
            draftMasterPlan: 'Учесть ограниченные территориальные параметры участка и перспективу развития транспортно-пешеходных коммуникаций. Следует располагать с отступом от красной линии согласно СН РК 3.01-01-2013.',
            verticalLayout: 'Увязать с высотными отметками ПДП прилегающей территории',
            landscapingAndGardening: 'В генплане указать нормативное описание',
            parking: '@hide',
            useOfFertileSoilLayer: '@hide',
            smallArchitecturalForms: '@hide',
            lighting: '@hide',
            stylisticsOfArchitecture: 'Сформировать архитектурный образ в соответствии с функциональными особенностями объекта',
            natureCombination: 'Подчиненный',
            colorSolution: '@hide',
            advertisingAndInformationSolution: '@hide',
            nightLighting: '@hide',
            inputNodes: '@hide',
            conditionsForLowMobileGroups: '@hide',
            complianceNoiseConditions: '@hide',
            plinth: '@hide',
            facade: 'Указать в проекте',
            heatSupply: 'Технические условия не предусмотрены',
            waterSupply: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
            sewerage: 'Согласно техническим условиям (№___ и даты выдачи ТУ)',
            powerSupply: 'Технические условия не предусмотрены',
            gasSupply: 'Технические условия не предусмотрены',
            phoneSupply: 'Технические условия не предусмотрены',
            drainage: 'Технические условия не предусмотрены',
            irrigationSystems: 'Технические условия не предусмотрены',
            engineeringSurveysObligation: 'Приступать к освоению земельного участка разрешается после геодезического выноса и закрепления его границ в натуре (на местности) и ордера на производство земляных работ',
            demolitionObligation: 'В случае необходимости краткое описание',
            transferCommunicationsObligation: 'В случае обнаружения проходящих инженерных коммуникаций предусмотреть конструктивные мероприятия по их защите, провести согласование с соответствующими инстанциями',
            conservationPlantObligation: 'Указать в проекте',
            temporaryFencingConstructionObligation: 'Указать в проекте',
            additionalRequirements: 'Общая площадь застройи согласно проекту',
            generalRequirements: '1. При разработке проекта (рабочего проекта) необходимо руководствоваться нормами действующего законодательства Республики Казахстан в сфере архитектурной, градостроительной и строительной деятельности.<br />2. Проектирование (при новом стороительстве) необходимо вести на материалах откорректированной топографическойм съемки в М 1:500 и геологичеких изысканий, выполненных ранее<br />3. Согласовать с главным архитектором города (района):<br />генеральный план в М 1:500;сводный план инженерных сетей;',
            notes: '1. АПЗ и ТУ действуют в течение всего срока нормативной продолжительности строительства, утвержденного в составе проектной (проектно-сметной) документации.<br />2. В случае возникновения обстоятельств, требующих пересмотра условий АПЗ, изменения в него могут быть внесены по согласованию с заказчиком.<br />3. Требования и условия, изложенные в АПЗ, обязательны для всех участников инвестиционного процесса независимо от форм собственности и источников финансирования. АПЗ по просьбе заказчика или местного органа архитектуры и градостроительства может быть предметом обсуждения градостроительного совета, архитектурной общественности, рассмотрено в независимой экспертизе.<br />4. Несогласие заказчика с требованиями, содержащимися в АПЗ, может быть обжаловано в судебном порядке.'
          });
          break;

        case 'redevelopment':
          this.setState({
            templateType: 'redevelopment',
            basisForDevelopmentApz: '1. Заявление застройщика<br />2. Акт на земельный участок.<br />3. Задание на проектирование утвержденное застройщиком (заказчиком)',
            buildingPresence: 'Строений нет',
            address: 'Город, район, микрорайон, аул, квартал',
            geodeticStudy: '@hide',
            engineeringGeologicalStudy: '@hide',
            planningSystem: 'По проекту с учетом функционального назначения объекта',
            functionalValueOfObject: 'Реконструкция входной группы с внутренней перепланировкой нежилого помещения',
            floorSum: '5 этажей',
            structuralScheme: 'По проекту',
            engineeringSupport: 'Централизованное. Запрещается перенос вертикальных инженерных коммуникаций жилого дома, проходящие в пределах квартиры.',
            energyEfficiencyClass: '@hide',
            spatialSolution: '@hide',
            draftMasterPlan: '@hide',
            verticalLayout: '@hide',
            landscapingAndGardening: '@hide',
            parking: '@hide',
            useOfFertileSoilLayer: '@hide',
            smallArchitecturalForms: '@hide',
            lighting: '@hide',
            stylisticsOfArchitecture: 'Сформировать в соответствии с функциональными особенностями объекта',
            natureCombination: 'Подчиненный',
            colorSolution: '@hide',
            advertisingAndInformationSolution: '@hide',
            nightLighting: '@hide',
            inputNodes: '@hide',
            conditionsForLowMobileGroups: '@hide',
            complianceNoiseConditions: '@hide',
            plinth: '@hide',
            facade: '@hide',
            heatSupply: 'Централизованный',
            waterSupply: 'Централизованный',
            sewerage: 'Централизованный',
            powerSupply: 'Централизованный',
            gasSupply: 'Централизованный',
            phoneSupply: 'Централизованный',
            drainage: '@hide',
            irrigationSystems: '@hide',
            engineeringSurveysObligation: '@hide',
            demolitionObligation: '@hide',
            transferCommunicationsObligation: 'В случае обнаружения проходящих инженерных коммуникаций предусмотреть конструктивные мероприятия по их защите, провести согласование с соответствующими инстанциями',
            conservationPlantObligation: '@hide',
            temporaryFencingConstructionObligation: '@hide',
            additionalRequirements: '@hide',
            generalRequirements: '1. При разработке проекта (рабочего проекта) необходимо руководствоваться нормами действующего законодательства Республики Казахстан в сфере архитектурной, градостроительной и строительной деятельности.<br />2. Проектирование (при новом стороительстве) необходимо вести на материалах откорректированной топографическойм съемки в М 1:500 и геологичеких изысканий, выполненных ранее<br />3. Согласовать с главным архитектором города (района):<br />генеральный план в М 1:500;сводный план инженерных сетей;',
            notes: '1. АПЗ и ТУ действуют в течение всего срока нормативной продолжительности строительства, утвержденного в составе проектной (проектно-сметной) документации.<br />2. В случае возникновения обстоятельств, требующих пересмотра условий АПЗ, изменения в него могут быть внесены по согласованию с заказчиком.<br />3. Требования и условия, изложенные в АПЗ, обязательны для всех участников инвестиционного процесса независимо от форм собственности и источников финансирования. АПЗ по просьбе заказчика или местного органа архитектуры и градостроительства может быть предметом обсуждения градостроительного совета, архитектурной общественности, рассмотрено в независимой экспертизе.<br />4. Несогласие заказчика с требованиями, содержащимися в АПЗ, может быть обжаловано в судебном порядке.'
          });
          break;
          default:
      }
    }

    onTemplateListChange(e) {
      if(e.target.value != ''){
        var template = this.state.templates.find(template => template.id == e.target.value);
        this.setState({ description: template.text });
      }
    }

    onInputChange(state, value) {
      // const { value, name } = e.target
      // this.setState({ [name] : value })
      value = value.replace(/(style=")([a-zA-Z0-9:;.\s()-,]*)(")/gi, '');
      this.setState({ [state] : value })
    }

    onFileChange(e) {
      this.setState({ file: e.target.files[0] });
    }

    onDescriptionChange(value) {
      this.setState({ description: value });
    }

    componentWillMount() {
      this.getApzInfo();
      this.getAnswerTemplates();
    }

    snakeToCamel(s){
      return s.replace(/_\w/g, (m) => m[1].toUpperCase() );
    }

    getAnswerTemplates(){
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/answer_template/all", true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          //console.log(JSON.parse(xhr.responseText));
          this.setState({templates: JSON.parse(xhr.responseText).data});
        }
      }.bind(this)
      xhr.onerror = function () {
        alert('Сервер не отвечает');
      }.bind(this);
      xhr.send();
    }

    getApzInfo() {
      var id = this.props.match.params.id;
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/stateservices/detail/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          //console.log(data.files);
          this.setState({apz: data});
          this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
          this.setState({confirmedTaskFile: data.files.filter(function(obj) { return obj.category_id === 9 })[0]});
          this.setState({titleDocumentFile: data.files.filter(function(obj) { return obj.category_id === 10 })[0]});
          this.setState({additionalFile: data.files.filter(function(obj) { return obj.category_id === 27 })[0]});
          this.setState({reglamentFile: data.files.filter(function(obj) { return obj.category_id === 29 })[0]});
          this.setState({response: data.apz_department_response ? true : false });
          this.setState({backFromGP: data.state_history.filter(function(obj) { return obj.state_id === 41 })[0]});
          this.setState({backFromEngineer: data.state_history.filter(function(obj) { return obj.state_id === 4 })[0]});
          for(var data_index = data.state_history.length-1; data_index >= 0; data_index--){
            switch (data.state_history[data_index].state_id) {
              case 38:
                this.setState({backFromHead: data.state_history[data_index]});
                break;
              default:
                continue;
            }
            break;
          }

          if (!data.apz_department_response && data.status_id === 6) {
            this.setState({showButtons: true});
          }

          if (data.files.filter(function(obj) { return obj.category_id === 18})[0] != null && data.status_id === 6) {
            this.setState({showSendButton: true});
          }

          if (data.apz_department_response && data.files.filter(function(obj) { return obj.category_id === 18})[0] == null && data.status_id === 6) {
            this.setState({showSignButtons: true});
          }

          if (data.apz_department_response) {
            Object.keys(data.apz_department_response).forEach(function(k) {
              let key = this.snakeToCamel(k);
              this.setState({ [key]: (data.apz_department_response[k] === null) ? '' : data.apz_department_response[k] });
            }.bind(this));
          }
        }
      }.bind(this)
      xhr.onerror = function () {
        alert('Сервер не отвечает');
        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }

    downloadFile(id, progbarId = null) {
      var token = sessionStorage.getItem('tokenInfo');

      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + 'api/file/download/' + id, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        var vision = $('.text-info[data-category='+progbarId+']');
        var progressbar = $('.progress[data-category='+progbarId+']');
        vision.css('display', 'none');
        progressbar.css('display', 'flex');
        xhr.onprogress = function(event) {
          $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100, 10) + '%');
        }
        xhr.onload = function() {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var base64ToArrayBuffer = (function () {

              return function (base64) {
                var binaryString = window.atob(base64);
                var binaryLen = binaryString.length;
                var bytes = new Uint8Array(binaryLen);

                for (var i = 0; i < binaryLen; i++) {
                  var ascii = binaryString.charCodeAt(i);
                  bytes[i] = ascii;
                }

                return bytes;
              }

            }());

            var saveByteArray = (function () {
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";

              return function (data, name) {
                var blob = new Blob(data, {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name;
                a.click();
                setTimeout(function() {
                  window.URL.revokeObjectURL(url);
                  $('div', progressbar).css('width', 0);
                  progressbar.css('display', 'none');
                  vision.css('display','inline');
                  alert("Файлы успешно загружены");
                },1000);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
          } else {
            $('div', progressbar).css('width', 0);
            progressbar.css('display', 'none');
            vision.css('display','inline');
            alert('Не удалось скачать файл');
          }
        }
      xhr.send();
    }

    setMissedHeartbeatsLimitToMax() {
      this.missed_heartbeats_limit = this.missed_heartbeats_limit_max;
    }

    setMissedHeartbeatsLimitToMin() {
      this.missed_heartbeats_limit = this.missed_heartbeats_limit_min;
    }

    browseKeyStore(storageName, fileExtension, currentDirectory, callBack) {
      var browseKeyStore = {
        "method": "browseKeyStore",
        "args": [storageName, fileExtension, currentDirectory]
      };
      this.callback = callBack;
      this.webSocketFunction();
      this.setMissedHeartbeatsLimitToMax();
      this.webSocket.send(JSON.stringify(browseKeyStore));
    }

    getKeys(storageName, storagePath, password, type, callBack) {
      var getKeys = {
        "method": "getKeys",
        "args": [storageName, storagePath, password, type]
      };
      this.callback = callBack;
      this.webSocketFunction();
      this.setMissedHeartbeatsLimitToMax();
      this.webSocket.send(JSON.stringify(getKeys));
    }

    chooseFile() {
      var browseKeyStore = {
        "method": "browseKeyStore",
        "args": [this.state.storageAlias, "P12", '']
      };
      this.callback = "chooseStoragePathBack";
      this.webSocketFunction();
      this.setMissedHeartbeatsLimitToMax();
      this.webSocket.send(JSON.stringify(browseKeyStore));
    }

    signMessage() {
      this.setState({loaderHidden: false});
      let password = document.getElementById("inpPassword").value;
      let path = document.getElementById("storagePath").value;
      let keyType = "SIGN";
      if (path !== null && path !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
        if (password !== null && password !== "") {
          this.getKeys(this.state.storageAlias, path, password, keyType, "loadKeysBack");
        } else {
          alert("Введите пароль к хранилищу");
          this.setState({loaderHidden: true});
        }
      } else {
        alert("Не выбран хранилище!");
        this.setState({loaderHidden: true});
      }
    }

    loadKeysBack(result) {
      if (result.errorCode === "WRONG_PASSWORD") {
        alert("Неверный пароль!");
        return false;
      }

      let alias = "";
      if (result && result.result) {
        let keys = result.result.split('/n');
        if (keys && keys.length > 0) {
          let arr = keys[0].split('|');
          alias = arr[3];
          this.getTokenXml(alias);
        }
      }
      if (!alias) {
        alert('Нет ключа подписания');
        this.setState({loaderHidden: true});
      }
    }

    getTokenXml(alias) {
      let password = document.getElementById("inpPassword").value;
      let storagePath = document.getElementById("storagePath").value;
      var token = sessionStorage.getItem('tokenInfo');

      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + 'api/apz/stateservices/get_xml/' + this.state.apz.id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        var tokenXml = xhr.responseText;

        if (storagePath !== null && storagePath !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
          if (password !== null && password !== "") {
            if (alias !== null && alias !== "") {
              if (tokenXml !== null && tokenXml !== "") {
                  this.signXml(this.state.storageAlias, storagePath, alias, password, tokenXml, "signXmlBack");
              }
              else {
                  alert("Нет данных для подписания!");
              }
            } else {
                alert("Вы не выбрали ключ!");
            }
          } else {
              alert("Введите пароль к хранилищу");
          }
        } else {
            alert("Не выбран хранилище!");
        }
      }.bind(this);
      xhr.send();
    }

    signXml(storageName, storagePath, alias, password, xmlToSign, callBack) {
      var signXml = {
        "method": "signXml",
        "args": [storageName, storagePath, alias, password, xmlToSign]
      };
      //console.log(xmlToSign);
      this.callback = callBack;
      this.webSocketFunction();
      this.setMissedHeartbeatsLimitToMax();
      this.webSocket.send(JSON.stringify(signXml));
    }

    signXmlBack(result) {
      if (result['errorCode'] === "NONE") {
        let signedXml = result.result;
        var token = sessionStorage.getItem('tokenInfo');
        var data = {xml: signedXml}

        console.log("SIGNED XML ------> \n", signedXml);

        var xhr = new XMLHttpRequest();
        xhr.open("post", window.url + 'api/apz/stateservices/save_xml/' + this.state.apz.id, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function() {
          if (xhr.status === 200) {
            this.setState({ showSendButton: true });
            alert('Успешно подписан.');
          } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
            alert(JSON.parse(xhr.responseText).message);
          } else {
            alert("Не удалось подписать файл");
          }
          this.setState({loaderHidden: true});
        }.bind(this);
        xhr.send(JSON.stringify(data));
      }
      else {
        if (result['errorCode'] === "WRONG_PASSWORD" && result['result'] > -1) {
          alert("Неправильный пароль! Количество оставшихся попыток: " + result['result']);
        } else if (result['errorCode'] === "WRONG_PASSWORD") {
          alert("Неправильный пароль!");
        } else {
          alert(result['errorCode']);
        }
      }
    }

    chooseStorage(storage) {
      this.browseKeyStore(storage, "P12", '', "chooseStoragePathBack");
    }

    chooseStoragePathBack(rw) {
      if (rw.getErrorCode() === "NONE") {
        var storagePath = rw.getResult();
        if (storagePath !== null && storagePath !== "") {
          document.getElementById("storagePath").value = storagePath;
        }
        else {
          document.getElementById("storagePath").value = "";
        }
      } else {
        document.getElementById("storagePath").value = "";
      }
    }

    webSocketFunction() {
      this.webSocket.onopen = function (event) {
        if (this.heartbeat_interval === "") {
          this.missed_heartbeats = 0;
          this.heartbeat_interval = setInterval(this.pingLayer, 2000);
        }
        console.log("Connection opened");
      }.bind(this);

      this.webSocket.onclose = function (event) {
        if (event.wasClean) {
          console.log('connection has been closed');
        }
        else {
          console.log('Connection error');
          this.openDialog();
        }
        console.log('Code: ' + event.code + ' Reason: ' + event.reason);
      }.bind(this);

      this.webSocket.onmessage = function (event) {
        if (event.data === this.heartbeat_msg) {
          this.missed_heartbeats = 0;
          return;
        }

        var result = JSON.parse(event.data);

        if (result != null) {
          var rw = {
            result: result['result'],
            secondResult: result['secondResult'],
            errorCode: result['errorCode'],
            getResult: function () {
              return this.result;
            },
            getSecondResult: function () {
              return this.secondResult;
            },
            getErrorCode: function () {
              return this.errorCode;
            }
          };

          switch (this.callback) {
            case 'chooseStoragePathBack':
              this.chooseStoragePathBack(rw);
              break;

            case 'loadKeysBack':
              this.loadKeysBack(rw);
              break;

            case 'signXmlBack':
              this.signXmlBack(rw);
              break;
            default:
              break;
          }
        }
        //console.log(event);
        this.setMissedHeartbeatsLimitToMin();
      }.bind(this);
    }

    openDialog() {
      if (window.confirm("Ошибка при подключений к прослойке. Убедитесь что программа запущена и нажмите ОК") === true) {
        window.location.reload();
      }
    }

    saveForm(apzId, status, comment) {
      var token = sessionStorage.getItem('tokenInfo');
      var data = {};

      Object.keys(this.state).forEach(function(k) {
        data[k] = (this.state[k] === '@hide') ? '' : this.state[k];
      }.bind(this));

      data.response = status;
      data.message = comment;

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/apz/stateservices/save/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function () {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);

          this.setState({ response: data.response });
          alert("Ответ сохранен!");
          this.setState({ showButtons: false });
          this.setState({ showSignButtons: true });
        }
        else if(xhr.status === 401){
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this);
      xhr.send(JSON.stringify(data));
    }

    hideSignBtns() {
      this.setState({ showButtons: true});
      this.setState({ showSignButtons: false });
    }

    sendForm(apzId, status, comment, direct) {
      var token = sessionStorage.getItem('tokenInfo');
      var formData = new FormData();
      formData.append('response', status);
      formData.append('message', comment);
      formData.append('direct', direct);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/apz/stateservices/status/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          alert("Заявление отправлено!");
          this.setState({ showButtons: false });
          this.setState({ showSendButton: false });
        } else if(xhr.status === 401){
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        }
      }.bind(this);
      xhr.send(formData);
    }

    // print technical condition
    printTechCon(apzId, project) {
      var token = sessionStorage.getItem('tokenInfo');
      if (token) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/apz/print/tc/electro/" + apzId, true);
        xhr.responseType = "blob";
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onload = function () {
          if (xhr.status === 200) {
            //test of IE
            if (typeof window.navigator.msSaveBlob === "function") {
              window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
            }
            else {
              var blob = xhr.response;
              var link = document.createElement('a');
              var today = new Date();
              var curr_date = today.getDate();
              var curr_month = today.getMonth() + 1;
              var curr_year = today.getFullYear();
              var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";
              //console.log(curr_day);
              link.href = window.URL.createObjectURL(blob);
              link.download = "ТУ-Электр-" + project + formated_date + ".pdf";

              //append the link to the document body
              document.body.appendChild(link);
              link.click();
            }
          }
        }
        xhr.send();
      } else {
        console.log('Время сессии истекло.');
      }
    }

    printApz(apzId, project) {
      var token = sessionStorage.getItem('tokenInfo');
      if (token) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/print/apz/" + apzId, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onload = function () {
          if (xhr.status === 200) {
            //test of IE
            if (typeof window.navigator.msSaveBlob === "function") {
              window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
            } else {
              var data = JSON.parse(xhr.responseText);
              var today = new Date();
              var curr_date = today.getDate();
              var curr_month = today.getMonth() + 1;
              var curr_year = today.getFullYear();
              var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";

              var base64ToArrayBuffer = (function () {

                return function (base64) {
                  var binaryString =  window.atob(base64);
                  var binaryLen = binaryString.length;
                  var bytes = new Uint8Array(binaryLen);

                  for (var i = 0; i < binaryLen; i++) {
                    var ascii = binaryString.charCodeAt(i);
                    bytes[i] = ascii;
                  }

                  return bytes;
                }

              }());

              var saveByteArray = (function () {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";

                return function (data, name) {
                  var blob = new Blob(data, {type: "octet/stream"}),
                      url = window.URL.createObjectURL(blob);
                  a.href = url;
                  a.download = name;
                  a.click();
                  setTimeout(function() {window.URL.revokeObjectURL(url);},0);
                };

              }());

              saveByteArray([base64ToArrayBuffer(data.file)], "апз-" + project + formated_date + ".pdf");
            }
          } else {
            alert('Не удалось скачать файл');
          }
        }
        xhr.send();
      } else {
        console.log('session expired');
      }
    }

    toggleMap(value) {
      this.setState({
        showMap: value
      })

      if (value) {
        this.setState({
          showMapText: 'Скрыть карту'
        })
      } else {
        this.setState({
          showMapText: 'Показать карту'
        })
      }
    }

  toDate(date) {
    if(date === null) {
      return date;
    }

    var jDate = new Date(date);
    var curr_date = jDate.getDate() < 10 ? "0" + jDate.getDate() : jDate.getDate();
    var curr_month = (jDate.getMonth() + 1) < 10 ? "0" + (jDate.getMonth() + 1) : jDate.getMonth() + 1;
    var curr_year = jDate.getFullYear();
    var curr_hour = jDate.getHours() < 10 ? "0" + jDate.getHours() : jDate.getHours();
    var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;

    return formated_date;
  }

    render() {
      var apz = this.state.apz;
      var counter = 1;

      if (apz.length === 0) {
        return false;
      }

      return (
        <div>
          <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>

          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <td style={{width: '22%'}}><b>ИД заявки</b></td>
                <td>{apz.id}</td>
              </tr>
              <tr>
                <td><b>Заявитель</b></td>
                <td>{apz.applicant}</td>
              </tr>
              <tr>
                <td><b>Телефон</b></td>
                <td>{apz.phone}</td>
              </tr>
              <tr>
                <td><b>Заказчик</b></td>
                <td>{apz.customer}</td>
              </tr>
              <tr>
                <td><b>Разработчик</b></td>
                <td>{apz.designer}</td>
              </tr>
              <tr>
                <td><b>Название проекта</b></td>
                <td>{apz.project_name}</td>
              </tr>
              <tr>
                <td><b>Адрес проектируемого объекта</b></td>
                <td>
                  {apz.project_address}

                  {apz.project_address_coordinates &&
                    <a className="ml-2 pointer text-info" onClick={this.toggleMap.bind(this, true)}>Показать на карте</a>
                  }
                </td>
              </tr>
              <tr>
                <td><b>Дата заявления</b></td>
                <td>{apz.created_at && this.toDate(apz.created_at)}</td>
              </tr>

              {this.state.personalIdFile &&
                <tr>
                  <td><b>Уд. лич./ Реквизиты</b></td>
                  <td><a className="text-info pointer" data-category="1" onClick={this.downloadFile.bind(this, this.state.personalIdFile.id, 1)}>Скачать</a>
                    <div className="progress mb-2" data-category="1" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                </tr>
              }

              {this.state.confirmedTaskFile &&
                <tr>
                  <td><b>Утвержденное задание</b></td>
                  <td><a className="text-info pointer" data-category="2" onClick={this.downloadFile.bind(this, this.state.confirmedTaskFile.id, 2)}>Скачать</a>
                    <div className="progress mb-2" data-category="2" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                </tr>
              }

              {this.state.titleDocumentFile &&
                <tr>
                  <td><b>Правоустанавл. документ</b></td>
                  <td><a className="text-info pointer" data-category="3" onClick={this.downloadFile.bind(this, this.state.titleDocumentFile.id, 3)}>Скачать</a>
                    <div className="progress mb-2" data-category="3" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                </tr>
              }

              {this.state.additionalFile &&
                <tr>
                  <td><b>Дополнительно</b></td>
                  <td><a className="text-info pointer" data-category="4" onClick={this.downloadFile.bind(this, this.state.additionalFile.id, 4)}>Скачать</a>
                    <div className="progress mb-2" data-category="4" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <h5 className="block-title-2 mb-3">Службы</h5>

          <table className="table table-bordered table-striped">
            <tbody>
              {!!apz.need_water_provider && apz.apz_water &&
                <tr>
                  <td style={{width: '40%'}}><b>Водоснабжение</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#water_modal">Просмотр</a></td>
                </tr>
              }

              {!!apz.need_heat_provider && apz.apz_heat &&
                <tr>
                  <td style={{width: '40%'}}><b>Теплоснабжение</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#heat_modal">Просмотр</a></td>
                </tr>
              }

              {!!apz.need_electro_provider && apz.apz_electricity &&
                <tr>
                  <td style={{width: '40%'}}><b>Электроснабжение</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#electro_modal">Просмотр</a></td>
                </tr>
              }

              {!!apz.need_gas_provider && apz.apz_gas &&
                <tr>
                  <td style={{width: '40%'}}><b>Газоснабжение</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#gas_modal">Просмотр</a></td>
                </tr>
              }

              {!!apz.need_phone_provider && apz.apz_phone &&
                <tr>
                  <td style={{width: '40%'}}><b>Телефонизация</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#phone_modal">Просмотр</a></td>
                </tr>
              }
            </tbody>
          </table>

          {apz.apz_water &&
            <div className="modal fade" id="water_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Водоснабжение</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                      <tbody>
                        <tr>
                          <td style={{width: '70%'}}>Общая потребность (м<sup>3</sup>/сутки)</td>
                          <td>{apz.apz_water.requirement}</td>
                        </tr>
                        <tr>
                          <td>Общая потребность питьевой воды (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_water.requirement_hour}</td>
                        </tr>
                        <tr>
                          <td>Общая потребность (л/сек макс)</td>
                          <td>{apz.apz_water.requirement_sec}</td>
                        </tr>
                        <tr>
                          <td>Хозпитьевые нужды (м<sup>3</sup>/сутки)</td>
                          <td>{apz.apz_water.drinking}</td>
                        </tr>
                        <tr>
                          <td>Хозпитьевые нужды (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_water.drinking_hour}</td>
                        </tr>
                        <tr>
                          <td>Хозпитьевые нужды (л/сек макс)</td>
                          <td>{apz.apz_water.drinking_sec}</td>
                        </tr>
                        <tr>
                          <td>Производственные нужды (м<sup>3</sup>/сутки)</td>
                          <td>{apz.apz_water.production}</td>
                        </tr>
                        <tr>
                          <td>Производственные нужды (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_water.production_hour}</td>
                        </tr>
                        <tr>
                          <td>Производственные нужды (л/сек макс)</td>
                          <td>{apz.apz_water.production_sec}</td>
                        </tr>
                        <tr>
                          <td>Расходы пожаротушения (л/сек наружное)</td>
                          <td>{apz.apz_water.fire_fighting}</td>
                        </tr>
                        <tr>
                          <td>Расходы пожаротушения (л/сек внутреннее)</td>
                          <td>{apz.apz_water.fire_fighting}</td>
                        </tr>
                      </tbody>
                    </table>

                    {apz.apz_sewage &&
                      <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                        <tbody>
                          <tr>
                            <td style={{width: '70%'}}>Общее количество сточных вод (м<sup>3</sup>/сутки)</td>
                            <td>{apz.apz_sewage.amount}</td>
                          </tr>
                          <tr>
                            <td>Общее количество сточных вод (м<sup>3</sup>/час макс)</td>
                            <td>{apz.apz_sewage.amount_hour}</td>
                          </tr>
                          <tr>
                            <td>Фекальных (м<sup>3</sup>/сутки)</td>
                            <td>{apz.apz_sewage.feksal}</td>
                          </tr>
                          <tr>
                            <td>Фекальных (м<sup>3</sup>/час макс)</td>
                            <td>{apz.apz_sewage.feksal_hour}</td>
                          </tr>
                          <tr>
                            <td>Производственно-загрязненных (м<sup>3</sup>/сутки)</td>
                            <td>{apz.apz_sewage.production}</td>
                          </tr>
                          <tr>
                            <td>Производственно-загрязненных (м<sup>3</sup>/час макс)</td>
                            <td>{apz.apz_sewage.production_hour}</td>
                          </tr>
                          <tr>
                            <td>Условно-чистых сбрасываемых на городскую сеть (м<sup>3</sup>/сутки)</td>
                            <td>{apz.apz_sewage.to_city}</td>
                          </tr>
                          <tr>
                            <td>Условно-чистых сбрасываемых на городскую сеть (м<sup>3</sup>/час макс)</td>
                            <td>{apz.apz_sewage.to_city_hour}</td>
                          </tr>
                        </tbody>
                      </table>
                    }
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          {apz.apz_heat &&
            <div className="modal fade" id="heat_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Теплоснабжение</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      <tbody>
                        <tr>
                          <td style={{width: '70%'}}>Общая нагрузка (Гкал/ч)</td>
                          <td>{apz.apz_heat.general}</td>
                        </tr>
                        <tr>
                          <td>Отопление (Гкал/ч)</td>
                          <td>{apz.apz_heat.main_heat}</td>
                        </tr>
                        <tr>
                          <td>Вентиляция (Гкал/ч)</td>
                          <td>{apz.apz_heat.main_ven}</td>
                        </tr>
                        <tr>
                          <td>Горячее водоснабжение, ср (Гкал/ч)</td>
                          <td>{apz.apz_heat.main_water}</td>
                        </tr>
                        <tr>
                          <td>Горячее водоснабжение, макс (Гкал/ч)</td>
                          <td>{apz.apz_heat.main_water_max}</td>
                        </tr>
                        <tr>
                          <td>Энергосб. мероприятие</td>
                          <td>{apz.apz_heat.saving}</td>
                        </tr>
                        <tr>
                          <td>Технолог. нужды(пар) (Т/ч)</td>
                          <td>{apz.apz_heat.tech}</td>
                        </tr>

                        {apz.apz_heat.contract_num &&
                          <tr>
                            <td>Номер договора</td>
                            <td>{apz.apz_heat.contract_num}</td>
                          </tr>
                        }

                        {apz.apz_heat.general_in_contract &&
                          <tr>
                            <td>Общая тепловая нагрузка по договору (Гкал/ч)</td>
                            <td>{apz.apz_heat.general_in_contract}</td>
                          </tr>
                        }

                        {apz.apz_heat.tech_in_contract &&
                          <tr>
                            <td>Технологическая нагрузка(пар) по договору (Гкал/ч)</td>
                            <td>{apz.apz_heat.tech_in_contract}</td>
                          </tr>
                        }

                        {apz.apz_heat.main_in_contract &&
                          <tr>
                            <td>Отопление по договору (Гкал/ч)</td>
                            <td>{apz.apz_heat.main_in_contract}</td>
                          </tr>
                        }

                        {apz.apz_heat.water_in_contract &&
                          <tr>
                            <td>Горячее водоснабжение по договору (ср/ч)</td>
                            <td>{apz.apz_heat.water_in_contract}</td>
                          </tr>
                        }

                        {apz.apz_heat.ven_in_contract &&
                          <tr>
                            <td>Вентиляция по договору (Гкал/ч)</td>
                            <td>{apz.apz_heat.ven_in_contract}</td>
                          </tr>
                        }

                        {apz.apz_heat.water_in_contract_max &&
                          <tr>
                            <td>Горячее водоснабжение по договору (макс/ч)</td>
                            <td>{apz.apz_heat.water_in_contract_max}</td>
                          </tr>
                        }
                      </tbody>
                    </table>

                    {apz.apz_heat.heatDistribution && apz.apz_heat.blocks &&
                      <div>
                        <div>Разделение нагрузки</div>
                        {apz.apz_heat.blocks.map(function(item, index) {
                          return(
                            <div key={index}>
                              {apz.apz_heat.blocks.length > 1 &&
                                <h5 className="block-title-2 mt-4 mb-3">Здание №{index + 1}</h5>
                              }

                              <table className="table table-bordered table-striped">
                                <tbody>
                                  <tr>
                                    <td style={{width: '70%'}}>Отопление (Гкал/ч)</td>
                                    <td>{item.main}</td>
                                  </tr>
                                  <tr>
                                    <td>Вентиляция (Гкал/ч)</td>
                                    <td>{item.ventilation}</td>
                                  </tr>
                                  <tr>
                                    <td>Горячее водоснаб. (ср/ч)</td>
                                    <td>{item.water}</td>
                                  </tr>
                                  <tr>
                                    <td>Горячее водоснаб. (макс/ч)</td>
                                    <td>{item.water_max}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          );
                        })}
                      </div>
                    }
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          {apz.apz_electricity &&
            <div className="modal fade" id="electro_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Электроснабжение</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      <tbody>
                        <tr>
                          <td style={{width: '60%'}}>Требуемая мощность (кВт)</td>
                          <td>{apz.apz_electricity.required_power}</td>
                        </tr>
                        <tr>
                          <td>Характер нагрузки (фаза)</td>
                          <td>{apz.apz_electricity.phase}</td>
                        </tr>
                        <tr>
                          <td>Категория (кВт)</td>
                          <td>{apz.apz_electricity.safety_category}</td>
                        </tr>
                        <tr>
                          <td>Из указ. макс. нагрузки относ. к э-приемникам (кВА)</td>
                          <td>{apz.apz_electricity.max_load_device}</td>
                        </tr>
                        <tr>
                          <td>Сущ. макс. нагрузка (кВА)</td>
                          <td>{apz.apz_electricity.max_load}</td>
                        </tr>
                        <tr>
                          <td>Мощность трансформаторов (кВА)</td>
                          <td>{apz.apz_electricity.allowed_power}</td>
                        </tr>

                        {this.state.claimedCapacityJustification &&
                          <tr>
                            <td>Расчет-обоснование заявленной мощности</td>
                            <td><a className="text-info pointer" data-category="5" onClick={this.downloadFile.bind(this, this.state.claimedCapacityJustification.id, 5)}>Скачать</a>
                              <div className="progress mb-2" data-category="5" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          {apz.apz_gas &&
            <div className="modal fade" id="gas_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Газоснабжение</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      <tbody>
                        <tr>
                          <td style={{width: '60%'}}>Общ. потребность (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_gas.general}</td>
                        </tr>
                        <tr>
                          <td>На приготов. пищи (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_gas.cooking}</td>
                        </tr>
                        <tr>
                          <td>Отопление (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_gas.heat}</td>
                        </tr>
                        <tr>
                          <td>Вентиляция (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_gas.ventilation}</td>
                        </tr>
                        <tr>
                          <td>Кондиционирование (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_gas.conditionaer}</td>
                        </tr>
                        <tr>
                          <td>Горячее водоснаб. (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_gas.water}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          {apz.apz_phone &&
            <div className="modal fade" id="phone_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Телефонизация</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      <tbody>
                        <tr>
                          <td style={{width: '60%'}}>Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</td>
                          <td>{apz.apz_phone.service_num}</td>
                        </tr>
                        <tr>
                          <td>Телефонная емкость</td>
                          <td>{apz.apz_phone.capacity}</td>
                        </tr>
                        <tr>
                          <td>Планируемая телефонная канализация</td>
                          <td>{apz.apz_phone.sewage}</td>
                        </tr>
                        <tr>
                          <td>Пожелания заказчика (тип оборудования, тип кабеля и др.)</td>
                          <td>{apz.apz_phone.client_wishes}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          {apz.commission && (Object.keys(apz.commission).length > 0) &&
            <div>
              <h5 className="block-title-2 mb-3">Ответы от служб</h5>
              <CommissionAnswersList apz={apz} />
            </div>
          }

          {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />}

          <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
            {this.state.showMapText}
          </button>

          {(apz.status_id !== 6 && this.state.response) &&
            <div>
              <h5 className="block-title-2 mt-5 mb-3">Результат</h5>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '22%'}}><b>Сформированный АПЗ</b></td>
                    <td><a className="text-info pointer" onClick={this.printApz.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          }

          {((this.state.showButtons || this.state.showSignButtons) && !this.state.showSendButton) && this.state.backFromEngineer &&
            <div>
              <form className="apz_department_form">
                <div className="select_type">
                  <span>Выберите тип: </span>
                  <div>
                    <label><input type="radio" name="template_type" onChange={this.onTypeChange.bind(this, 'big_object')} checked={this.state.templateType === 'big_object'} /><span>Большой объект</span></label>
                    <label><input type="radio" name="template_type" onChange={this.onTypeChange.bind(this, 'small_object')} checked={this.state.templateType === 'small_object'} /><span>Малый объект</span></label>
                    <label><input type="radio" name="template_type" onChange={this.onTypeChange.bind(this, 'network_engineering')} checked={this.state.templateType === 'network_engineering'} /><span>Инженерные сети</span></label>
                    <label><input type="radio" name="template_type" onChange={this.onTypeChange.bind(this, 'redevelopment')} checked={this.state.templateType === 'redevelopment'} /><span>Внутренняя перепл. многоквартирного жилого дома</span></label>
                  </div>
                </div>

                <div>
                  <h5>{counter++}. Характеристика участка</h5>
                  <div className="form-group">
                    <label>Основание для разработки архитектурно-планировочного задания (АПЗ)</label>
                    <ReactQuill value={this.state.basisForDevelopmentApz} onChange={this.onInputChange.bind(this, 'basisForDevelopmentApz')} />
                  </div>
                  <div className="form-group">
                    <label>Наличие застройки</label>
                    <ReactQuill value={this.state.buildingPresence} onChange={this.onInputChange.bind(this, 'buildingPresence')} />
                  </div>
                  <div className="form-group">
                    <label>Местонахождение участка</label>
                    <ReactQuill value={this.state.address} onChange={this.onInputChange.bind(this, 'address')} />
                  </div>

                  {this.state.geodeticStudy !== '@hide' &&
                    <div className="form-group">
                      <label>Геодезическая изученность</label>
                      <ReactQuill value={this.state.geodeticStudy} onChange={this.onInputChange.bind(this, 'geodeticStudy')} />
                    </div>
                  }

                  {this.state.engineeringGeologicalStudy !== '@hide' &&
                    <div className="form-group">
                      <label>Инженерно-геологическая изученность</label>
                      <ReactQuill value={this.state.engineeringGeologicalStudy} onChange={this.onInputChange.bind(this, 'engineeringGeologicalStudy')} />
                    </div>
                  }

                  <div className="form-group">
                    <label>Планировочная система</label>
                    <ReactQuill value={this.state.planningSystem} onChange={this.onInputChange.bind(this, 'planningSystem')} />
                  </div>
                </div>

                <div>
                  <h5>{counter++}. Характеристика проектируемого объекта</h5>
                  <div className="form-group">
                    <label>Функциональное значение объекта</label>
                    <ReactQuill value={this.state.functionalValueOfObject} onChange={this.onInputChange.bind(this, 'functionalValueOfObject')} />
                  </div>

                  {this.state.floorSum !== '@hide' &&
                    <div className="form-group">
                      <label>Этажность</label>
                      <ReactQuill value={this.state.floorSum} onChange={this.onInputChange.bind(this, 'floorSum')} />
                    </div>
                  }

                  {this.state.structuralScheme !== '@hide' &&
                    <div className="form-group">
                      <label>Конструктивная схема</label>
                      <ReactQuill value={this.state.structuralScheme} onChange={this.onInputChange.bind(this, 'structuralScheme')} />
                    </div>
                  }

                  <div className="form-group">
                    <label>Инженерное обеспечение</label>
                    <ReactQuill value={this.state.engineeringSupport} onChange={this.onInputChange.bind(this, 'engineeringSupport')} />
                  </div>

                  {this.state.energyEfficiencyClass !== '@hide' &&
                    <div className="form-group">
                      <label>Класс энергоэффективности</label>
                      <ReactQuill value={this.state.energyEfficiencyClass} onChange={this.onInputChange.bind(this, 'energyEfficiencyClass')} />
                    </div>
                  }
                </div>

                {this.state.templateType !== 'redevelopment' &&
                  <div>
                    <h5>{counter++}. Градостроительные требования</h5>

                    {this.state.spatialSolution !== '@hide' &&
                      <div className="form-group">
                        <label>Объемно-пространственное решение</label>
                        <ReactQuill value={this.state.spatialSolution} onChange={this.onInputChange.bind(this, 'spatialSolution')} />
                      </div>
                    }

                    {this.state.draftMasterPlan !== '@hide' &&
                      <div className="form-group">
                        <label>Проект генерального плана</label>
                        <ReactQuill value={this.state.draftMasterPlan} onChange={this.onInputChange.bind(this, 'draftMasterPlan')} />
                      </div>
                    }

                    {this.state.verticalLayout !== '@hide' &&
                      <div className="form-group">
                        <label>Вертикальная планировка</label>
                        <ReactQuill value={this.state.verticalLayout} onChange={this.onInputChange.bind(this, 'verticalLayout')} />
                      </div>
                    }

                    {this.state.landscapingAndGardening !== '@hide' &&
                      <div className="form-group">
                        <label>Благоустройство и озеленение</label>
                        <ReactQuill value={this.state.landscapingAndGardening} onChange={this.onInputChange.bind(this, 'landscapingAndGardening')} />
                      </div>
                    }

                    {this.state.parking !== '@hide' &&
                      <div className="form-group">
                        <label>Парковка автомобилей</label>
                        <ReactQuill value={this.state.parking} onChange={this.onInputChange.bind(this, 'parking')} />
                      </div>
                    }

                    {this.state.useOfFertileSoilLayer !== '@hide' &&
                      <div className="form-group">
                        <label>Использование плодородного слоя почвы</label>
                        <ReactQuill value={this.state.useOfFertileSoilLayer} onChange={this.onInputChange.bind(this, 'useOfFertileSoilLayer')} />
                      </div>
                    }

                    {this.state.smallArchitecturalForms !== '@hide' &&
                      <div className="form-group">
                        <label>Малые архитектурные формы</label>
                        <ReactQuill value={this.state.smallArchitecturalForms} onChange={this.onInputChange.bind(this, 'smallArchitecturalForms')} />
                      </div>
                    }

                    {this.state.lighting !== '@hide' &&
                      <div className="form-group">
                        <label>Освещение</label>
                        <ReactQuill value={this.state.lighting} onChange={this.onInputChange.bind(this, 'lighting')} />
                      </div>
                    }
                  </div>
                }

                <div>
                  <h5>{counter++}. Архитектурные требования</h5>
                  <div className="form-group">
                    <label>Стилистика архитектурного образа</label>
                    <ReactQuill value={this.state.stylisticsOfArchitecture} onChange={this.onInputChange.bind(this, 'stylisticsOfArchitecture')} />
                  </div>
                  <div className="form-group">
                    <label>Характер сочетания с окружающей застройкой</label>
                    <ReactQuill value={this.state.natureCombination} onChange={this.onInputChange.bind(this, 'natureCombination')} />
                  </div>

                  {this.state.colorSolution !== '@hide' &&
                    <div className="form-group">
                      <label>Цветовое решение</label>
                      <ReactQuill value={this.state.colorSolution} onChange={this.onInputChange.bind(this, 'colorSolution')} />
                    </div>
                  }

                  {this.state.advertisingAndInformationSolution !== '@hide' &&
                    <div className="form-group">
                      <label>Рекламно-информационное решение</label>
                      <ReactQuill value={this.state.advertisingAndInformationSolution} onChange={this.onInputChange.bind(this, 'advertisingAndInformationSolution')} />
                    </div>
                  }

                  {this.state.nightLighting !== '@hide' &&
                    <div className="form-group">
                      <label>Ночное световое оформление</label>
                      <ReactQuill value={this.state.nightLighting} onChange={this.onInputChange.bind(this, 'nightLighting')} />
                    </div>
                  }

                  {this.state.inputNodes !== '@hide' &&
                    <div className="form-group">
                      <label>Входные узлы</label>
                      <ReactQuill value={this.state.inputNodes} onChange={this.onInputChange.bind(this, 'inputNodes')} />
                    </div>
                  }

                  {this.state.conditionsForLowMobileGroups !== '@hide' &&
                    <div className="form-group">
                      <label>Создание условий для жизнедеятельности маломобильных групп населения</label>
                      <ReactQuill value={this.state.conditionsForLowMobileGroups} onChange={this.onInputChange.bind(this, 'conditionsForLowMobileGroups')} />
                    </div>
                  }

                  {this.state.complianceNoiseConditions !== '@hide' &&
                    <div className="form-group">
                      <label>Соблюдение условий по звукошумовым показателям</label>
                      <ReactQuill value={this.state.complianceNoiseConditions} onChange={this.onInputChange.bind(this, 'complianceNoiseConditions')} />
                    </div>
                  }
                </div>

                {this.state.templateType !== 'redevelopment' &&
                  <div>
                    <h5>{counter++}. Требования к наружной отделке</h5>

                    {this.state.plinth !== '@hide' &&
                      <div className="form-group">
                        <label>Цоколь</label>
                        <ReactQuill value={this.state.plinth} onChange={this.onInputChange.bind(this, 'plinth')} />
                      </div>
                    }

                    {this.state.facade !== '@hide' &&
                      <div className="form-group">
                        <label>Фасад. Ограждающие конструкций</label>
                        <ReactQuill value={this.state.facade} onChange={this.onInputChange.bind(this, 'facade')} />
                      </div>
                    }
                  </div>
                }

                <div>
                  <h5>{counter++}. Требования к инженерным сетям</h5>
                  <div className="form-group">
                    <label>Теплоснабжение</label>
                    <ReactQuill value={this.state.heatSupply} onChange={this.onInputChange.bind(this, 'heatSupply')} />
                  </div>
                  <div className="form-group">
                    <label>Водоснабжение</label>
                    <ReactQuill value={this.state.waterSupply} onChange={this.onInputChange.bind(this, 'waterSupply')} />
                  </div>
                  <div className="form-group">
                    <label>Канализация</label>
                    <ReactQuill value={this.state.sewerage} onChange={this.onInputChange.bind(this, 'sewerage')} />
                  </div>
                  <div className="form-group">
                    <label>Электроснабжение</label>
                    <ReactQuill value={this.state.powerSupply} onChange={this.onInputChange.bind(this, 'powerSupply')} />
                  </div>
                  <div className="form-group">
                    <label>Газоснабжение</label>
                    <ReactQuill value={this.state.gasSupply} onChange={this.onInputChange.bind(this, 'gasSupply')} />
                  </div>
                  <div className="form-group">
                    <label>Телекоммуникация и телерадиовещания</label>
                    <ReactQuill value={this.state.phoneSupply} onChange={this.onInputChange.bind(this, 'phoneSupply')} />
                  </div>

                  {this.state.drainage !== '@hide' &&
                    <div className="form-group">
                      <label>Дренаж (при необходимости) и ливневая канализация</label>
                      <ReactQuill value={this.state.drainage} onChange={this.onInputChange.bind(this, 'drainage')} />
                    </div>
                  }

                  {this.state.irrigationSystems !== '@hide' &&
                    <div className="form-group">
                      <label>Стационарные поливочные системы</label>
                      <ReactQuill value={this.state.irrigationSystems} onChange={this.onInputChange.bind(this, 'irrigationSystems')} />
                    </div>
                  }
                </div>

                <div>
                  <h5>{counter++}. Обязательства, возлагаемые на застройщика</h5>

                  {this.state.engineeringSurveysObligation !== '@hide' &&
                    <div className="form-group">
                      <label>По инженерным изысканиям</label>
                      <ReactQuill value={this.state.engineeringSurveysObligation} onChange={this.onInputChange.bind(this, 'engineeringSurveysObligation')} />
                    </div>
                  }

                  {this.state.demolitionObligation !== '@hide' &&
                    <div className="form-group">
                      <label>По сносу (переносу) существующих строений и сооружений</label>
                      <ReactQuill value={this.state.demolitionObligation} onChange={this.onInputChange.bind(this, 'demolitionObligation')} />
                    </div>
                  }

                  <div className="form-group">
                    <label>По переносу существующих подземных и надземных коммуникаций</label>
                    <ReactQuill value={this.state.transferCommunicationsObligation} onChange={this.onInputChange.bind(this, 'transferCommunicationsObligation')} />
                  </div>

                  {this.state.conservationPlantObligation !== '@hide' &&
                    <div className="form-group">
                      <label>По сохранению и/или пересадке зеленых насаждений</label>
                      <ReactQuill value={this.state.conservationPlantObligation} onChange={this.onInputChange.bind(this, 'conservationPlantObligation')} />
                    </div>
                  }

                  {this.state.temporaryFencingConstructionObligation !== '@hide' &&
                    <div className="form-group">
                      <label>По строительству временного ограждения участка</label>
                      <ReactQuill value={this.state.temporaryFencingConstructionObligation} onChange={this.onInputChange.bind(this, 'temporaryFencingConstructionObligation')} />
                    </div>
                  }
                </div>

                {this.state.additionalRequirements !== '@hide' &&
                  <div>
                    <h5>{counter++}. Дополнительные требования</h5>
                    <div className="form-group">
                      <ReactQuill value={this.state.additionalRequirements} onChange={this.onInputChange.bind(this, 'additionalRequirements')} />
                    </div>
                  </div>
                }

                <div>
                  <h5>{counter++}. Общие требования</h5>
                  <div className="form-group">
                    <ReactQuill value={this.state.generalRequirements} onChange={this.onInputChange.bind(this, 'generalRequirements')} />
                  </div>
                </div>

                <div>
                  <h5>Примечания</h5>
                  <div className="form-group">
                    <ReactQuill value={this.state.notes} onChange={this.onInputChange.bind(this, 'notes')} />
                  </div>
                </div>

                <div>
                  <h5>Номер документа</h5>
                  <div className="form-group">
                    <input type="text" value={this.state.docNumber} className="form-control" onChange={(e) => this.setState({ docNumber: e.target.value })} />
                  </div>
                </div>
              </form>
            </div>
          }

          {this.state.backFromHead &&
            <div className="alert alert-danger">
              Комментарий главного архитектора: {this.state.backFromHead.comment}
            </div>
          }

          {this.state.reglamentFile &&
            <div className="col-md-4 offset-4">
              <div className="row" style={{paddingTop:'5px',paddingBottom:'5px',backgroundColor:'#eeeeff'}}>
                <div className="col-md-6"><b>Регламент</b></div>
                <div className="col-md-6">
                  <a className="text-info pointer" data-category="6" onClick={this.downloadFile.bind(this, this.state.reglamentFile.id, 6)}><b>Скачать</b></a>
                  <div className="progress mb-2" data-category="6" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              </div>
            </div>
          }

          {this.state.showSignButtons && !this.state.showSendButton &&
            <div style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
              <div>Выберите хранилище</div>

              <div className="btn-group mb-2" role="group" style={{margin: 'auto', display: 'table'}}>
                <button className="btn btn-raised" style={{marginRight: '5px'}} onClick={this.chooseFile.bind(this)}>файловое хранилище</button>
                <button className="btn btn-raised" onClick={this.chooseStorage.bind(this, 'AKKaztokenStore')}>eToken</button>
              </div>

              <div className="form-group">
                <input className="form-control" placeholder="Путь к ключу" type="hidden" id="storagePath" />
                <input className="form-control" placeholder="Пароль" id="inpPassword" type="password" />
              </div>
              {!this.state.loaderHidden &&
              <div style={{margin: '0 auto'}}>
                  <Loader type="Ball-Triangle" color="#46B3F2" height="70" width="70" />
              </div>
              }
              {this.state.loaderHidden &&
              <div className="form-group">
                  <button className="btn btn-raised btn-success" type="button"
                          onClick={this.signMessage.bind(this)}>Подписать
                  </button>
                  <button className="btn btn-primary" type="button" style={{marginLeft: '5px'}}
                          onClick={this.hideSignBtns.bind(this)}>Назад
                  </button>
              </div>
              }
            </div>
          }

          {this.state.showButtons && !this.state.showSendButton &&
            <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
            {!this.state.backFromGP &&
              <button type="button" style={{marginRight:'5px'}} className="btn btn-raised btn-success" onClick={this.sendForm.bind(this, apz.id, true, "", 'gen_plan')}>Отправить отделу ген плана</button>
            }
            {(this.state.backFromEngineer && apz.apz_department_response) ?
              <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.saveForm.bind(this, apz.id, true, "")}>
                Сохранить
              </button>
              :
              <button type="button" style={{marginRight:'5px'}} className="btn btn-raised btn-success" onClick={this.sendForm.bind(this, apz.id, true, "", 'engineer')}>Отправить инженеру</button>
            }
              <button type="button" className="btn btn-raised btn-danger" data-toggle="modal" data-target="#declined_modal">Отклонить</button>
            </div>
          }

          {this.state.showSendButton &&
            <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', display: 'table'}}>
              <button type="button" className="btn btn-raised btn-success" onClick={this.sendForm.bind(this, apz.id, true, "", 'head')}>Отправить начальнику Гос Услуг</button>
            </div>
          }

          <div className="modal fade" id="declined_modal" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Мотивированный отказ</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {this.state.templates && this.state.templates.length > 0 &&
                    <div className="form-group">
                      <select className="form-control" defaultValue="" id="templateList" onChange={this.onTemplateListChange.bind(this)}>
                        <option value="">Выберите шаблон</option>
                        {this.state.templates.map(function(template, index) {
                          return(
                            <option key={index} value={template.id}>{template.title}</option>
                            );
                          })
                        }
                      </select>
                    </div>
                  }
                  <div className="form-group">
                    <label>Причина отклонения</label>
                    <ReactQuill value={this.state.description} onChange={this.onDescriptionChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-raised btn-success" style={{marginRight:'5px'}} data-dismiss="modal" onClick={this.sendForm.bind(this, apz.id, false, this.state.description, 'lawyer')}>
                    Отправить Юристу
                  </button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                </div>
              </div>
            </div>
          </div>

          {apz.state_history.length > 0 &&
            <div>
              <h5 className="block-title-2 mb-3 mt-3">Логи</h5>
              <div className="border px-3 py-2">
                {apz.state_history.map(function(state, index) {
                  return(
                    <div key={index}>
                      <p className="mb-0">{state.created_at}&emsp;{state.state.name} {state.receiver && '('+state.receiver+')'}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          }

          <hr />
          <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
        </div>
      )
    }
  }
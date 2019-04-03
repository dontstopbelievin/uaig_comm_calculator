import React from 'react';
import $ from 'jquery';
import Loader from 'react-loader-spinner';
import ReactQuill from 'react-quill';
import CommissionAnswersList from '../components/CommissionAnswersList';
import ShowMap from "../components/ShowMap";
import EcpSign from "../components/EcpSign";
import AllInfo from "../components/AllInfo";
import Logs from "../components/Logs";
import Answers from "../components/Answers";

export default class ShowApz extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        apz: [],
        templates: [],
        theme: '',
        showMap: false,
        showButtons: false,
        showSendButton: false,
        showSignButtons: false,
        file: null,
        comment: "",
        docNumber: "",
        response: false,
        personalIdFile: false,
        confirmedTaskFile: false,
        titleDocumentFile: false,
        additionalFile: false,
        showMapText: 'Показать карту',
        accept: true,
        templateType: '',
        backFromHead: false,
        backFromGP: false,
        backFromEngineer: false,
        schemeComment: false,
        schemeFile: false,
        calculationComment: false,
        calculationFile: false,
        reglamentComment: false,
        reglamentFile: false,
        otkazFile: false,

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
      this.onCommentChange = this.onCommentChange.bind(this);
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

    onInputChange(state, value) {
      // const { value, name } = e.target
      // this.setState({ [name] : value })
      value = value.replace(/(style=")([a-zA-Z0-9:;.\s()-,]*)(")/gi, '');
      this.setState({ [state] : value })
    }

    onFileChange(e) {
      this.setState({ file: e.target.files[0] });
    }

    onCommentChange(value) {
      this.setState({ comment: value });
    }

    onThemeChange(e) {
      this.setState({ theme: e.target.value });
    }

    componentWillMount() {
      this.getApzInfo();
      this.getAnswerTemplates();
    }

    onTemplateListChange(e) {
      if(e.target.value != ''){
        var template = this.state.templates.find(template => template.id == e.target.value);
        this.setState({ comment: template.text });
        this.setState({ theme: template.title });
      }else{
        this.setState({ theme: '' });
      }
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

    snakeToCamel(s){
      return s.replace(/_\w/g, (m) => m[1].toUpperCase() );
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
          this.setState({reglamentComment: data.state_history.filter(function(obj) { return obj.state_id === 42 })[0]});
          this.setState({reglamentFile: data.files.filter(function(obj) { return obj.category_id === 29 })[0]});
          this.setState({schemeComment: data.state_history.filter(function(obj) { return obj.state_id === 56 })[0]});
          this.setState({schemeFile: data.files.filter(function(obj) { return obj.category_id === 38 })[0]});
          this.setState({calculationComment: data.state_history.filter(function(obj) { return obj.state_id === 57 })[0]});
          this.setState({calculationFile: data.files.filter(function(obj) { return obj.category_id === 39 })[0]});
          this.setState({response: data.apz_department_response ? true : false });
          this.setState({backFromGP: data.state_history.filter(function(obj) { return obj.state_id === 53 })[0]});
          this.setState({backFromEngineer: data.state_history.filter(function(obj) { return obj.state_id === 4 })[0]});
          this.setState({otkazFile: data.files.filter(function(obj) { return obj.category_id === 30 })[0]});
          for(var data_index = data.state_history.length-1; data_index >= 0; data_index--){
            switch (data.state_history[data_index].state_id) {
              case 33:
                this.setState({backFromHead: data.state_history[data_index]});
                break;
              default:
                continue;
            }
            break;
          }

          if (!data.apz_department_response && (data.status_id === 6 || data.status_id === 4 || data.status_id === 11 || data.status_id === 13
          || data.status_id === 14 || data.status_id === 15)) {
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
      console.log(comment);
      if(!status && comment != 'otkaz' && (comment.trim() == '' || this.state.theme.trim() == '')){
        alert('Для отказа напишите тему и причину отказа.');
        return false;
      }
      if (comment == 'otkaz' && !this.state.otkazFile) {
        alert('Загрузите файл отказа');
        return false;
      }

      var token = sessionStorage.getItem('tokenInfo');
      var registerData = {
        response: status,
        message: comment,
        theme: this.state.theme,
        direct: direct
      };
      if(comment == 'otkaz'){ registerData['otkazFile'] = this.state.otkazFile; }
      var data = JSON.stringify(registerData);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/apz/stateservices/status/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function () {
        if (xhr.status === 200) {
          alert("Заявление отправлено!");
        } else if(xhr.status === 401){
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        }
        switch (direct) {
          case 'gen_plan':
            this.setState({backFromGP: true});
            break;
          case 'engineer':
            this.setState({backFromEngineer: true});
            break;
          default:
          this.setState({ showButtons: false });
          this.setState({ showSendButton: false });
        }
        if (!status) {
          $('#ReturnApzForm').modal('hide');
          $('#accDecApzForm').modal('hide');
        }
      }.bind(this);
      xhr.send(data);
    }

    uploadFile(category, e) {
      if(e.target.files[0] == null){ return;}
      var file = e.target.files[0];
      var name = file.name.replace(/\.[^/.]+$/, "");
      var progressbar = $('.progress[data-category=' + category + ']');
      if (!file || !category) {
        alert('Не удалось загрузить файл');

        return false;
      }

      var formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('category', category);
      progressbar.css('display', 'flex');
      $.ajax({
        type: 'POST',
        url: window.url + 'api/file/upload',
        contentType: false,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
        },
        processData: false,
        data: formData,
        xhr: function() {
          var xhr = new window.XMLHttpRequest();

          xhr.upload.addEventListener("progress", function(evt) {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100, 10);
              $('div', progressbar).css('width', percentComplete + '%');
            }
          }, false);

          return xhr;
        },
        success: function (response) {
          var data = {id: response.id, name: response.name};

          setTimeout(function() {
            progressbar.css('display', 'none');
            switch (category) {
              case 30:
                this.setState({otkazFile: data});
                break;
              default:
            }
            alert("Файл успешно загружен");
          }.bind(this), '1000')
        }.bind(this),
        error: function (response) {
          progressbar.css('display', 'none');
          alert("Не удалось загрузить файл");
        }
      });
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

    ecpSignSuccess(){
      this.setState({ showSignButtons: false });
      this.setState({ showSendButton: true });
    }

    render() {
      var counter = 1;

      return (
        <div>
          <AllInfo historygoBack={this.props.history.goBack} toggleMap={this.toggleMap.bind(this, true)} apz={this.state.apz} personalIdFile={this.state.personalIdFile} confirmedTaskFile={this.state.confirmedTaskFile} titleDocumentFile={this.state.titleDocumentFile}
            additionalFile={this.state.additionalFile} claimedCapacityJustification={this.state.claimedCapacityJustification}/>

          {this.state.apz.commission && (Object.keys(this.state.apz.commission).length > 0) &&
            <div>
              <h5 className="block-title-2 mb-3">Ответы от служб</h5>
              <CommissionAnswersList apz={this.state.apz} />
            </div>
          }

          {this.state.showMap && <ShowMap coordinates={this.state.apz.project_address_coordinates} mapId={"b5a3c97bd18442c1949ba5aefc4c1835"} />}

          <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
            {this.state.showMapText}
          </button>

          <Answers engineerReturnedState={this.state.engineerReturnedState} apzReturnedState={this.state.apzReturnedState}
                   backFromHead={this.state.backFromHead} apz_department_response={this.state.apz.apz_department_response} apz_id={this.state.apz.id} p_name={this.state.apz.project_name}
                   apz_status={this.state.apz.status_id} schemeComment={this.state.schemeComment} otkazFile={this.state.otkazFile}
                   calculationComment={this.state.calculationComment} reglamentComment={this.state.reglamentComment} schemeFile={this.state.schemeFile}
                   calculationFile={this.state.calculationFile} reglamentFile={this.state.reglamentFile}/>

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

          {this.state.showSignButtons && !this.state.showSendButton &&
              <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="stateservices" id={this.state.apz.id} serviceName='apz'/>
          }

          {this.state.showButtons && !this.state.showSendButton &&
            <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
            {(!this.state.backFromGP || !this.state.reglamentFile) &&
              <button type="button" style={{marginRight:'5px'}} className="btn btn-raised btn-success" onClick={this.sendForm.bind(this, this.state.apz.id, true, "", 'gen_plan')}>Отправить отделу ген плана</button>
            }
            {(this.state.backFromEngineer && !this.state.apz.apz_department_response) ?
              <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.saveForm.bind(this, this.state.apz.id, true, "")}>
                Сохранить
              </button>
              :
              <button type="button" style={{marginRight:'5px'}} className="btn btn-raised btn-success" onClick={this.sendForm.bind(this, this.state.apz.id, true, "", 'engineer')}>Отправить инженеру</button>
            }
              <button type="button" className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm" style={{marginRight:'5px'}}>Мотивированный отказ</button>
              <button type="button" className="btn btn-raised btn-danger" data-toggle="modal" data-target="#accDecApzForm">Запрос</button>
            </div>
          }

          {this.state.showSendButton &&
            <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', display: 'table'}}>
              <button type="button" className="btn btn-raised btn-success" onClick={this.sendForm.bind(this, this.state.apz.id, true, "", 'head')} style={{marginRight:'5px'}}>Отправить начальнику Гос Услуг</button>
              <button type="button" className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm" style={{marginRight:'5px'}}>Мотивированный отказ</button>
              <button type="button" className="btn btn-raised btn-danger" data-toggle="modal" data-target="#accDecApzForm">Запрос</button>
            </div>
          }

          <div className="modal fade" id="ReturnApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Мотивированный отказ</h5>
                  <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
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
                    <label>Тема(краткое описание)</label>
                    <div>
                      <input value={this.state.theme} onChange={this.onThemeChange.bind(this)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Причина отказа</label>
                    <ReactQuill value={this.state.comment} onChange={this.onCommentChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-raised btn-success" style={{marginRight:'5px'}} onClick={this.sendForm.bind(this, this.state.apz.id, false, this.state.comment, 'lawyer')}>Отправить Юристу</button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal fade" id="accDecApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Причина отказа</h5>
                  <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <div className="file_container">
                      <div className="progress mb-2" data-category="30" style={{height: '20px', display: 'none'}}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      {this.state.otkazFile &&
                        <div className="file_block mb-2">
                          <div>
                            {this.state.otkazFile.name}
                            <a className="pointer" onClick={(e) => this.setState({otkazFile: false}) }>×</a>
                          </div>
                        </div>
                      }
                      <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                        <label><h6>Файл отказа</h6></label>
                        <label htmlFor="otkazFile" className="btn btn-success" style={{marginLeft: '5px'}}>Загрузить</label>
                        <input type="file" id="otkazFile" name="otkazFile" className="form-control" onChange={this.uploadFile.bind(this, 30)} style={{display: 'none'}} />
                      </div>
                      <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-raised btn-success" style={{marginRight:'5px'}} onClick={this.sendForm.bind(this, this.state.apz.id, false, 'otkaz', 'lawyer')}>Отправить Юристу</button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                </div>
              </div>
            </div>
          </div>

          <Logs state_history={this.state.apz.state_history} />
          <button className="btn btn-outline-secondary pull-right btn-sm" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
        </div>
      )
    }
  }

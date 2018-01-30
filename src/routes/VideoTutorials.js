import React from 'react';
import $ from 'jquery';
//import { NavLink } from 'react-router-dom';

export default class VideoTutorials extends React.Component {
  componentDidMount() {
    $('#video_list .list-group-item').click(function() {
      var state = $(this).hasClass('active');

      $('#video_list .list-group-item').removeClass('active');
      $('.video_block').slideUp('fast');
      $('.slide_icon').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');

      if (!state) {
        $(this).addClass('active');
        $($(this).attr('href')).slideDown('fast');
        $('.slide_icon', this).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
      }
    });
  }

  render() {
    return (
      <div className="content container video_tutorials-plan-page">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Пример работы</h4></div>
          <div className="card-body">
            <div className="list-group" id="video_list">
              <a className="list-group-item list-group-item-action" data-toggle="list" href="#tab1">
                <i className="glyphicon glyphicon-play"></i>
                <div className="bmd-list-group-col">
                  <p className="list-group-item-heading pointer mb-0">
                    2D сцена с ветром
                  </p>
                </div>
                <i className="slide_icon glyphicon glyphicon-chevron-down pull-xs-right pointer"></i>
              </a>
              <div className="video_block" id="tab1" style={{ display: 'none' }}>
                <div className="row">
                  <div className="col-sm-6">
                    <iframe title="windFlow2D" width="500" height="250" src="https://www.youtube.com/embed/-BPqC07h3bc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                  </div>
                  <div className="col-sm-6">
                    <p>На сцене для 2д анализа, показано движение ветра, который проходит через отдельный микрорайон. Отчетливо показано как ведет себя ветер проходя через жилой массив: изменение скорости и завивания. Данный вид сцены поможет показать где и как нужно строить здания так, чтобы ветер свободно циркулировал и в свою очередь не образовывал смог.</p>
                  </div>
                </div>
              </div>
              <a className="list-group-item list-group-item-action" data-toggle="list" href="#tab2">
                <i className="glyphicon glyphicon-play"></i>
                <div className="bmd-list-group-col">
                  <p className="list-group-item-heading pointer mb-0">
                    3D сцена с ветром
                  </p>
                </div>
                <i className="slide_icon glyphicon glyphicon-chevron-down pull-xs-right pointer"></i>
              </a>
              <div className="video_block" id="tab2" style={{ display: 'none' }}>
                <div className="row">
                  <div className="col-sm-6">
                    <iframe title="windFlow3D" width="500" height="250" src="https://www.youtube.com/embed/2sPBYBLq8gQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                  </div>
                  <div className="col-sm-6">
                    <p>В видео показано движение ветра в отдельном микрорайоне в 3д сцене. На нем видно, как воздушные массы огибают здания образуя сквозняки либо затишья, сталкиваясь с другими зданиями. Также продемонстрирована ветровая нагрузка, которую оказывает ветер на здания при скорости 10м\с.  Различия в нагрузке можно определить визуально, так как имеется цветовой спектр, которому соответствует определенное значение.  На шкале за 0 берется значение давления при скорости ветра 10м\с.</p>
                  </div>
                </div>
              </div>
              <a className="list-group-item list-group-item-action" data-toggle="list" href="#tab3">
                <i className="glyphicon glyphicon-play"></i>
                <div className="bmd-list-group-col">
                  <p className="list-group-item-heading pointer mb-0">
                    2D сцена с давлением
                  </p>
                </div>
                <i className="slide_icon glyphicon glyphicon-chevron-down pull-xs-right pointer"></i>
              </a>
              <div className="video_block" id="tab3" style={{ display: 'none' }}>
                <div className="row">
                  <div className="col-sm-6">
                    <iframe title="windLoad" width="500" height="250" src="https://www.youtube.com/embed/_vu65k6aLIQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                  </div>
                  <div className="col-sm-6">
                    <p>Данная сцена нам показывает, как распределяется ветровая нагрузка при скорости 10м\с. На ней мы можем увидеть, что здания в оранжевой и желтой зонах испытывают наибольшую нагрузку при ветре. И мы можем сказать, что при неблагоприятных погодных условиях ветер может нанести повреждения на конструкции здания. Те здания, которые находятся в зелёной зоне, не будут получать ущерба при сильном ветре. В легенде за 0 была взята отметка давления при скорости 10м\с., и мы видим, что максимально возможная отметка давления является 168, а наименьшая -172.</p>
                  </div>
                </div>
              </div>
              <a className="list-group-item list-group-item-action" data-toggle="list" href="#tab4">
                <i className="glyphicon glyphicon-play"></i>
                <div className="bmd-list-group-col">
                  <p className="list-group-item-heading pointer mb-0">
                    3D модель города Алматы
                  </p>
                </div>
                <i className="slide_icon glyphicon glyphicon-chevron-down pull-xs-right pointer"></i>
              </a>
              <div className="video_block" id="tab4" style={{ display: 'none' }}>
                <div className="row">
                  <div className="col-sm-6">
                    <iframe title="almaty3D" width="500" height="250" src="https://www.youtube.com/embed/bjhCE7sKr8s" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                  </div>
                  <div className="col-sm-6">
                    <p>На сцене изображена 3д модель города Алматы, полученного на основе данных С БПЛА компании ТОО «KazAeroSpace», и произведен ортофотоплан. Он имеет разрешение 10 см, что является довольно высоким качеством на текущий момент.</p>
                  </div>
                </div>
              </div>
            </div>
            <p>Данные сцены предназначены для анализа в строительстве, экологических исследованиях и других сферах деятельности. Например, в том же градостроительстве данные модели помогут спроектировать расположение будущих зданий так чтобы воздух не задерживался в определенной зоне и не образовывался смог.  В строительстве проектировщик сможет с помощью данных моделей просмотреть на какие части им спроектированного здания будет оказана наибольшая ветровая нагрузка и в следствии сможет усилить свое здание в том или ином месте.</p>
          </div>
        </div>
      </div>
    )
  }
}
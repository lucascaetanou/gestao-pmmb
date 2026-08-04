$medicos = @(
  @{ id=1; nome="VORDANIA LEAL BAREA"; cpf="081.008.061-46"; municipio="MARACANAU"; regional="TRIGESIMO QUINTO"; tipo="INTERCAMBISTA MAIS MEDICOS"; vulnerabilidade="Media Vulnerabilidade"; inicio="2023-12-14"; contato_email="leal19cuba@gmail.com"; contato_telefone="(85) 96795-8866" },
  @{ id=2; nome="DASNIER TAMAYO PUPO"; cpf="002.169.631-90"; municipio="FORTALEZA"; regional="TRIGESIMO QUINTO"; tipo="INTERCAMBISTA MAIS MEDICOS"; vulnerabilidade="Media Vulnerabilidade"; inicio="2023-12-11"; contato_email="dasniertpupo@gmail.com"; contato_telefone="(85) 99279-8721" },
  @{ id=3; nome="YADIRA RODRIGUEZ LEZCANO"; cpf="081.659.631-80"; municipio="DISTRITO SANITARIO ESPECIAL INDIGENA CEARA"; regional="TRIGESIMO QUINTO"; tipo="INTERCAMBISTA MAIS MEDICOS"; vulnerabilidade="Media Vulnerabilidade"; inicio="2023-12-11"; contato_email="yida0601@gmail.com"; contato_telefone="(85) 99940-9078" },
  @{ id=4; nome="IDELBA ROSA IZQUIERDO ESTRADA"; cpf="087.548.981-08"; municipio="FORTIM"; regional="TRIGESIMO QUINTO"; tipo="INTERCAMBISTA MAIS MEDICOS"; vulnerabilidade="Alta Vulnerabilidade"; inicio="2023-12-13"; contato_email="izquierdocastrodaidelba@gmail.com"; contato_telefone="(85) 99764-7808" },
  @{ id=5; nome="MARICELA VINALS CARDOZA"; cpf="084.187.861-75"; municipio="FORTALEZA"; regional="TRIGESIMO QUINTO"; tipo="INTERCAMBISTA MAIS MEDICOS"; vulnerabilidade="Media Vulnerabilidade"; inicio="2025-04-16"; contato_email="maricelavinals@gmail.com"; contato_telefone="(85) 99246-2020" },
  @{ id=6; nome="YADIRA VERA LEYVA"; cpf="081.004.531-10"; municipio="FORTALEZA"; regional="TRIGESIMO QUINTO"; tipo="INTERCAMBISTA MAIS MEDICOS"; vulnerabilidade="Media Vulnerabilidade"; inicio="2023-12-20"; contato_email="yadiraveraleyva@gmail.com"; contato_telefone="(85) 98162-4755" },
  @{ id=7; nome="YUNIEL REYNALDO GONZALEZ"; cpf="081.106.021-89"; municipio="LIMOEIRO DO NORTE"; regional="TRIGESIMO QUINTO"; tipo="INTERCAMBISTA MAIS MEDICOS"; vulnerabilidade="Media Vulnerabilidade"; inicio="2025-07-28"; contato_email="yunielreynaldo13@gmail.com"; contato_telefone="(85) 99562-1194" },
  @{ id=8; nome="CARLOS ALBERTO VALERO RONDON"; cpf="067.785.351-30"; municipio="IPU"; regional="QUADRAGÉSIMO PRIMEIRO"; tipo="INTERCAMBISTA MAIS MEDICOS"; vulnerabilidade="Alta Vulnerabilidade"; inicio="2025-09-02"; contato_email="cvalero1965@gmail.com"; contato_telefone="(85) 99974-0454" }
)
$medicos | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 data/medicos.json

$supervisores = @(
  @{ id=1; nome="ROBERTO RIBEIRO MARANHAO"; residencia="AQUIRAZ"; instituicao="ESCOLA DE SAUDE PUBLICA DO CEARA"; titulacao="Mestrado"; especialidade="Medicina de Familia e Comunidade"; situacao="Ativo" },
  @{ id=2; nome="Silvio Paulo da Costa Araujo Rocha Furtado"; residencia="FORTALEZA"; instituicao="UNIVERSIDADE FEDERAL DO CEARA"; titulacao="Residencia Medica"; especialidade="Hematologia e Hemoterapia"; situacao="Ativo" },
  @{ id=3; nome="Tatiana Monteiro Fiuza"; residencia="FORTALEZA"; instituicao="ESCOLA DE SAUDE PUBLICA DO CEARA"; titulacao="Doutorado"; especialidade="Medicina de Familia e Comunidade"; situacao="Ativo" },
  @{ id=4; nome="Vera Lucia de Azevedo Dantas"; residencia="FORTALEZA"; instituicao="SECRETARIA MUNICIPAL DE SAUDE DE FORTALEZA"; titulacao="Doutorado"; especialidade="Saude Coletiva"; situacao="Ativo" }
)
$supervisores | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 data/supervisores.json

$secretarios = @(
  @{ id=1; nome="Maria de Fatima Viana Gois"; municipio="OCARA"; regiao="22a Regiao"; telefone="(85) 99151-4817"; email="fatimaviana@ocara.ce.gov.br"; endereco="Rua Jose Correia S/N" },
  @{ id=2; nome="Everton Ferreira da Silva"; municipio="OROS"; regiao="17a Regiao"; telefone="(85) 98952-4823"; email="dreverton_lva2020@gmail.com"; endereco="Praca Anastacio Maia 40" }
)
$secretarios | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 data/secretarios.json

$referencias = @(
  @{ id=1; nome="Tatiane Almeida"; regioes="Norte, Sertao Central"; municipios=75; vagas=455; medicos_ativos=411; desocupadas=74 },
  @{ id=2; nome="Alyne Cuba"; regioes="Cariri, Litoral Leste"; municipios=65; vagas=313; medicos_ativos=265; desocupadas=48 },
  @{ id=3; nome="Marcossuel Acioles"; regioes="Fortaleza"; municipios=44; vagas=546; medicos_ativos=415; desocupadas=92 }
)
$referencias | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 data/referencias.json

$instituicoes = @(
  @{ id=1; nome="ESCOLA DE SAUDE DA FAMILIA VISCONDE DE SABOIA"; sigla="ESFVS"; uf="CE"; num_supervisores=40; num_cidades=5; cidades=@("Sobral", "Meruoca", "Massape", "Alcantaras", "Santana") },
  @{ id=2; nome="ESCOLA DE SAUDE PUBLICA DO CEARA"; sigla="ESP-CE"; uf="CE"; num_supervisores=30; num_cidades=8; cidades=@("Fortaleza", "Caucaia", "Maracanau", "Eusebio", "Aquiraz") }
)
$instituicoes | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 data/instituicoes.json

$processos = @(
  @{ id=1; municipio="Fortaleza - CE"; tipo_solicitacao="FINANCEIRO"; status="FINALIZADO"; nivel="NORMAL"; referencia="MAR"; data_recebimento="2026-05-18" },
  @{ id=2; municipio="Sao Goncalo do Amarante - CE"; tipo_solicitacao="REMANEJAMENTO"; status="FINALIZADO"; nivel="NORMAL"; referencia="Tatiane Almeida"; data_recebimento="2026-06-01" },
  @{ id=3; municipio="Aquiraz - CE"; tipo_solicitacao="DEVOLUCAO"; status="FINALIZADO"; nivel="URGENTE"; referencia="TATIANE ALMEIDA"; data_recebimento="2026-06-10" }
)
$processos | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 data/processos.json

@() | ConvertTo-Json | Set-Content -Encoding UTF8 data/tutores.json

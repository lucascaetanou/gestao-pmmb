if (!(Test-Path "data")) { New-Item -ItemType Directory -Path "data" }

$municipios = @("FORTALEZA", "SOBRAL", "JUAZEIRO DO NORTE", "MARACANAÚ", "CAUCAIA", "CRATO", "ITAPIPOCA", "QUIXADÁ", "IGUATU", "PACAJUS", "AQUIRAZ", "EUSÉBIO", "LIMOEIRO DO NORTE", "ARACATI", "CANINDÉ", "CRATEÚS", "TIANGUÁ", "RUSSAS", "PARACURU", "PALMÁCIA", "OCARA", "ORÓS", "ICAPUÍ", "PACOTI", "GUARAMIRANGA")
$regionais = @("TRIGÉSIMO QUINTO", "PRIMEIRO", "DÉCIMO PRIMEIRO", "VIGÉSIMO SEGUNDO", "QUADRAGÉSIMO PRIMEIRO")
$tipos = @("INTERCAMBISTA MAIS MÉDICOS", "CRM BRASIL MAIS MÉDICOS")
$vulnerabilidades = @("Média Vulnerabilidade", "Alta Vulnerabilidade", "Muito Alta Vulnerabilidade", "Sem Vulnerabilidade")

# medicos.json
$nomes_medicos = @("VORDANIA LEAL BAREA", "DASNIER TAMAYO PUPO", "YADIRA RODRIGUEZ LEZCANO", "IDELBA ROSA IZQUIERDO ESTRADA", "MARICELA VINALS CARDOZA", "YADIRA VERA LEYVA", "YUNIEL REYNALDO GONZALEZ", "CARLOS ALBERTO VALERO RONDON", "ANA SILVA", "BRUNO COSTA", "CARLOS SOUZA", "DIANA LIMA", "EDUARDO MENDES", "FERNANDA ALVES", "GABRIEL ROCHA", "HELENA GOMES", "IGOR SANTOS", "JULIA CARVALHO", "LUCAS MARTINS", "MARIANA PEREIRA", "NICOLAS ARAUJO", "OLIVIA RIBEIRO", "PAULO BARBOSA", "QUINTINO CASTRO", "RAFAELA MELO", "SAMUEL NOGUEIRA", "TAIS FARIAS", "ULYSSES CARDOSO", "VITORIA CUNHA", "WAGNER PIRES")

$medicos = 1..30 | ForEach-Object {
    $idx = $_ - 1
    @{
        id = $_
        nome = $nomes_medicos[$idx]
        cpf = "{0:D3}.{1:D3}.{2:D3}-{3:D2}" -f (Get-Random -Min 100 -Max 999), (Get-Random -Min 100 -Max 999), (Get-Random -Min 100 -Max 999), (Get-Random -Min 10 -Max 99)
        municipio = $municipios[$idx % $municipios.Count]
        regional = $regionais[$idx % $regionais.Count]
        tipo = $tipos[$idx % $tipos.Count]
        vulnerabilidade = $vulnerabilidades[$idx % $vulnerabilidades.Count]
        inicio = "2023-12-14"
        contato_email = "medico$($_)@gmail.com"
        contato_telefone = "(85) 9 9765-4321"
    }
}
$medicos | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 data/medicos.json

# supervisores.json
$instituicoes = @("ESCOLA DE SAÚDE DA FAMÍLIA VISCONDE DE SABÓIA", "ESCOLA DE SAÚDE PÚBLICA DO CEARÁ", "UNIVERSIDADE FEDERAL DO CEARÁ", "UNIVERSIDADE FEDERAL DO CARIRI", "SECRETARIA MUNICIPAL DE SAÚDE DE FORTALEZA", "UNIVERSIDADE DA INTEGRAÇÃO INTERNACIONAL DA LUSOFONIA AFRO-BRASILEIRA")
$titulacoes = @("Mestrado", "Doutorado", "Especialização", "Residência Médica", "Graduação")
$especialidades = @("Medicina de Família e Comunidade", "Hematologia e Hemoterapia", "Saúde Coletiva", "Endocrinologia e Metabologia", "Clínica Médica", "Ginecologia e Obstetrícia", "Pediatria", "Pneumologia")

$nomes_sup = @("ROBERTO RIBEIRO MARANHÃO", "Silvio Paulo da Costa Araújo Rocha Furtado", "Tatiana Monteiro Fiuza", "Vera Lúcia de Azevedo Dantas", "Ricarla Maria Oliveira Brito do Bomfim", "Virgínia Oliveira Fernandes", "ROGÉRIO PINTO GIESTA", "VANESSA MONT ALVERNE ANGELIM MONTEIRO", "Zeus Peron Barbosa do Nascimento", "SILVANA MARIA DE SOUSA ALVES GOMES", "SAFIRA GOMES PORTELLA", "TALES COELHO SAMPAIO", "ROBERTINA PINHEIRO ROBERTO", "VIVIANE CHAVES PEREIRA", "TALITA CARNEIRO DE CARVALHO", "Supervisor 16", "Supervisor 17", "Supervisor 18", "Supervisor 19", "Supervisor 20")

$supervisores = 1..20 | ForEach-Object {
    $idx = $_ - 1
    @{
        id = $_
        nome = $nomes_sup[$idx]
        residencia = $municipios[$idx % $municipios.Count]
        instituicao = $instituicoes[$idx % $instituicoes.Count]
        titulacao = $titulacoes[$idx % $titulacoes.Count]
        especialidade = $especialidades[$idx % $especialidades.Count]
        situacao = "Ativo"
    }
}
$supervisores | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 data/supervisores.json

# secretarios.json
$nomes_sec = @("Maria de Fátima Viana Gois", "Everton Ferreira da Silva", "Mariana Elba Costa", "Roseane Gomes Monteiro Menezes", "Samilly de Sousa Barros", "Dayana Marques Rodrigues", "Rafaella Nunes da Silva", "Mateus Sampaio Andrade Rocha de Holanda Farias", "Loide Chrystine Peixoto Landim", "Francisco Wellington de Castro", "Secretário 11", "Secretário 12", "Secretário 13", "Secretário 14", "Secretário 15", "Secretário 16", "Secretário 17", "Secretário 18", "Secretário 19", "Secretário 20")

$secretarios = 1..20 | ForEach-Object {
    $idx = $_ - 1
    @{
        id = $_
        nome = $nomes_sec[$idx]
        municipio = $municipios[$idx % $municipios.Count]
        regiao = "$($idx + 1)ª Região"
        telefone = "(85) 9 9151-4817"
        email = "secretario$($_)@saude.gov.br"
        endereco = "Rua Principal, S/N - Centro"
    }
}
$secretarios | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 data/secretarios.json

# referencias.json
$referencias = @(
    @{ id = 1; nome = "Tatiane Almeida"; regioes = "Norte, Sertão Central"; municipios = 75; vagas = 455; medicos_ativos = 411; desocupadas = 74 },
    @{ id = 2; nome = "Alyne Cuba"; regioes = "Cariri, Litoral Leste"; municipios = 65; vagas = 313; medicos_ativos = 265; desocupadas = 48 },
    @{ id = 3; nome = "Marcossuel Acioles"; regioes = "Fortaleza"; municipios = 44; vagas = 546; medicos_ativos = 415; desocupadas = 92 }
)
$referencias | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 data/referencias.json

# instituicoes.json
$inst_list = @(
    @{ id = 1; nome = "ESCOLA DE SAÚDE DA FAMÍLIA VISCONDE DE SABÓIA"; sigla = "ESFVS"; uf = "CE"; num_supervisores = 40; num_cidades = 5; cidades = @("Sobral", "Meruoca", "Massapê", "Alcântaras", "Santana do Acaraú") },
    @{ id = 2; nome = "ESCOLA DE SAÚDE PÚBLICA DO CEARÁ"; sigla = "ESP-CE"; uf = "CE"; num_supervisores = 30; num_cidades = 8; cidades = @("Fortaleza", "Caucaia", "Maracanaú", "Eusébio", "Aquiraz", "Pacatuba", "Itaitinga", "Guaiúba") },
    @{ id = 3; nome = "SECRETARIA MUNICIPAL DE SAÚDE DE FORTALEZA"; sigla = "SMS/FOR"; uf = "CE"; num_supervisores = 21; num_cidades = 2; cidades = @("Fortaleza", "Eusébio") },
    @{ id = 4; nome = "UNIVERSIDADE FEDERAL DO CEARÁ"; sigla = "UFC"; uf = "CE"; num_supervisores = 20; num_cidades = 2; cidades = @("Fortaleza", "Sobral") },
    @{ id = 5; nome = "UNIVERSIDADE FEDERAL DO CARIRI"; sigla = "UFCA"; uf = "CE"; num_supervisores = 20; num_cidades = 3; cidades = @("Juazeiro do Norte", "Crato", "Barbalha") },
    @{ id = 6; nome = "UNIVERSIDADE DA INTEGRAÇÃO INTERNACIONAL DA LUSOFONIA AFRO-BRASILEIRA"; sigla = "UNILAB"; uf = "CE"; num_supervisores = 8; num_cidades = 4; cidades = @("Redenção", "Acarape", "Baturité", "Aracoiaba") }
)
$inst_list | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 data/instituicoes.json

# processos.json
$processos = @(
    @{ id = 1; municipio = "Fortaleza - CE"; tipo_solicitacao = "FINANCEIRO"; status = "FINALIZADO"; nivel = "NORMAL"; referencia = "MAR"; data_recebimento = "2026-05-18" },
    @{ id = 2; municipio = "São Gonçalo do Amarante - CE"; tipo_solicitacao = "REMANEJAMENTO"; status = "FINALIZADO"; nivel = "NORMAL"; referencia = "Tatiane Almeida"; data_recebimento = "2026-06-01" },
    @{ id = 3; municipio = "Aquiraz - CE"; tipo_solicitacao = "DEVOLUÇÃO"; status = "FINALIZADO"; nivel = "URGENTE"; referencia = "TATIANE ALMEIDA"; data_recebimento = "2026-06-10" },
    @{ id = 4; municipio = "Canindé - CE"; tipo_solicitacao = "REDUÇÃO DE CARGA HORÁRIA"; status = "FINALIZADO"; nivel = "NORMAL"; referencia = "ALYNE CUBA"; data_recebimento = "2026-06-20" },
    @{ id = 5; municipio = "Pentecoste - CE"; tipo_solicitacao = "FINANCEIRO"; status = "FINALIZADO"; nivel = "NORMAL"; referencia = "NÍVEL CENTRAL"; data_recebimento = "2026-06-25" },
    @{ id = 6; municipio = "Crateús - CE"; tipo_solicitacao = "REMANEJAMENTO"; status = "PENDENTE"; nivel = "URGENTE"; referencia = "ALYNE CUBA"; data_recebimento = "2026-06-30" },
    @{ id = 7; municipio = "Fortaleza - CE"; tipo_solicitacao = "FINANCEIRO"; status = "FINALIZADO"; nivel = "NORMAL"; referencia = "MAR"; data_recebimento = "2026-07-05" },
    @{ id = 8; municipio = "Fortaleza - CE"; tipo_solicitacao = "DEVOLUÇÃO"; status = "PENDENTE"; nivel = "NORMAL"; referencia = "TATIANE ALMEIDA"; data_recebimento = "2026-07-08" }
)
$processos | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 data/processos.json

# tutores.json
@() | ConvertTo-Json | Set-Content -Encoding UTF8 data/tutores.json

Write-Host "Data generation complete!"

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateNguonGenDto {
  @IsString() ma: string;
  @IsString() ten: string;
  @IsString() khoa_hoc: string;
  @IsString() don_vi: string;
  @IsString() phan_nhom: string;
  @IsString() nhom: string;
  @IsNumber() lat: number;
  @IsNumber() lng: number;
}

export class UpdateNguonGenDto {
  @IsOptional() @IsString() ten?: string;
  @IsOptional() @IsString() khoa_hoc?: string;
  @IsOptional() @IsString() don_vi?: string;
  @IsOptional() @IsString() phan_nhom?: string;
  @IsOptional() @IsString() nhom?: string;
  @IsOptional() @IsNumber() lat?: number;
  @IsOptional() @IsNumber() lng?: number;
}

@Injectable()
export class NguonGenService {
  constructor(private prisma: PrismaService) {}

  findAll(nhom?: string, search?: string) {
    return this.prisma.nguonGen.findMany({
      where: {
        ...(nhom ? { nhom } : {}),
        ...(search ? {
          OR: [
            { ten: { contains: search } },
            { ma: { contains: search } },
            { khoa_hoc: { contains: search } },
          ],
        } : {}),
      },
      orderBy: { ma: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.nguonGen.findUnique({ where: { id } });
  }

  create(dto: CreateNguonGenDto) {
    return this.prisma.nguonGen.create({ data: dto });
  }

  update(id: number, dto: UpdateNguonGenDto) {
    return this.prisma.nguonGen.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.nguonGen.delete({ where: { id } });
  }

  stats() {
    return this.prisma.nguonGen.groupBy({
      by: ['nhom'],
      _count: { id: true },
    });
  }
}
